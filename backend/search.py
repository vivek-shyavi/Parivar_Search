import mysql.connector
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from queue import Queue
import time
import math
import logging
import jellyfish
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(threadName)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database configuration - modify these values according to your database
db_config = {
    'host': '127.0.0.1',
    'port': 3307,
    'user': 'root',
    'password': 'mindlinks@2024',
    'database': 'indiangenealogy'
}

class HindiNameSearch:
    def __init__(self):
        self.db = None
        self.cursor = None
        self.variation_cache = {}
        self.similarity_cache = {}
        self.thread_local = threading.local()
        self.results_queue = Queue()

    def normalize_text(self, text):
        if not text:
            return ""
        return ' '.join(text.strip().split()).lower()

    # def get_name_variations(self, name):
    #     if not name:
    #         return set()
            
    #     cache_key = name
    #     if cache_key in self.variation_cache:
    #         return self.variation_cache[cache_key]
            
    #     variations = set()
    #     name = self.normalize_text(name)
    #     variations.add(name)
        
    #     try:
    #         # Handle English to Hindi
    #         if re.match(r'^[A-Za-z\s]+$', name):
    #             hindi_name = transliterate(name, sanscript.ITRANS, sanscript.DEVANAGARI)
    #             variations.add(hindi_name)
                
    #             # Common variations
    #             name_parts = name.split()
    #             for part in name_parts:
    #                 if part.endswith('a'):
    #                     variations.add(name.replace(part, part[:-1]))
                    
    #             variations.add(name.replace('sh', 's'))
    #             variations.add(name.replace('s', 'sh'))
    #             variations.add(name.replace('v', 'w'))
    #             variations.add(name.replace('w', 'v'))
    #             variations.add(name.replace('f', 'ph'))
    #             variations.add(name.replace('ph', 'f'))
                
    #         # Handle Hindi to English    
    #         elif any('\u0900' <= c <= '\u097F' for c in name):
    #             eng_name = transliterate(name, sanscript.DEVANAGARI, sanscript.ITRANS)
    #             variations.add(eng_name)
                
    #             if eng_name.endswith('a'):
    #                 variations.add(eng_name[:-1])
                    
    #     except Exception as e:
    #         logger.error(f"Error generating variations: {e}")
            
    #     self.variation_cache[cache_key] = variations
    #     return variations
    
    def get_name_variations(self, name):
        hindi_name = transliterate(name, sanscript.ITRANS, sanscript.DEVANAGARI)
        print(hindi_name)
        return hindi_name

    def calculate_similarity(self, str1, str2):
        if not str1 or not str2:
            return 0
            
        cache_key = (str1, str2)
        if cache_key in self.similarity_cache:
            return self.similarity_cache[cache_key]

        str1 = self.normalize_text(str1)
        str2 = self.normalize_text(str2)

        if str1 == str2:
            return 1.0

        # Calculate similarity scores
        jaro_sim = jellyfish.jaro_winkler_similarity(str1, str2)
        
        # Calculate Levenshtein for better accuracy
        lev_dist = jellyfish.levenshtein_distance(str1, str2)
        max_len = max(len(str1), len(str2))
        lev_sim = 1 - (lev_dist / max_len) if max_len > 0 else 0
        
        # Weighted combination of similarities
        total_sim = (jaro_sim * 0.6) + (lev_sim * 0.4)
        
        # Boost high similarity matches
        if total_sim > 0.8:
            total_sim = min(1.0, total_sim * 1.2)
            
        self.similarity_cache[cache_key] = total_sim
        return total_sim

    def get_db_cursor(self):
        if not hasattr(self.thread_local, "db"):
            logger.info(f"Creating new database connection for thread {threading.current_thread().name}")
            self.thread_local.db = mysql.connector.connect(**db_config)
            self.thread_local.cursor = self.thread_local.db.cursor(dictionary=True)
        return self.thread_local.cursor

    def close_thread_connection(self):
        if hasattr(self.thread_local, "cursor"):
            self.thread_local.cursor.close()
        if hasattr(self.thread_local, "db"):
            self.thread_local.db.close()
            logger.info(f"Closed database connection for thread {threading.current_thread().name}")

    def process_record_batch(self, records, given_name_vars, surname_vars, father_name_vars, min_similarity):
        thread_name = threading.current_thread().name
        logger.info(f"{thread_name} starting to process {len(records)} records")
        start_time = time.time()
        
        local_matches = []
        for record in records:
            match_scores = {'given_name': 0, 'surname': 0, 'father_name': 0}
            fields_searched = 0
            total_score = 0
            
            if given_name_vars and record['given_name']:
                max_sim = max(
                    self.calculate_similarity(var, record['given_name'])
                    for var in given_name_vars
                )
                match_scores['given_name'] = max_sim
                total_score += max_sim
                fields_searched += 1
            
            if surname_vars and record['surname']:
                max_sim = max(
                    self.calculate_similarity(var, record['surname'])
                    for var in surname_vars
                )
                match_scores['surname'] = max_sim
                total_score += max_sim
                fields_searched += 1
            
            if father_name_vars and record['father_name']:
                max_sim = max(
                    self.calculate_similarity(var, record['father_name'])
                    for var in father_name_vars
                )
                match_scores['father_name'] = max_sim
                total_score += max_sim
                fields_searched += 1
            
            if fields_searched > 0:
                average_similarity = total_score / fields_searched
                if average_similarity >= min_similarity:
                    local_matches.append({
                        'record': record,
                        'overall_similarity': average_similarity,
                        'field_scores': match_scores
                    })
        
        processing_time = time.time() - start_time
        logger.info(f"{thread_name} completed processing in {processing_time:.2f} seconds. Found {len(local_matches)} matches")
        self.results_queue.put(local_matches)

    def search_specific_fields(self, given_name="", surname="", father_name="", min_similarity=0.7):
        if not any([given_name, surname, father_name]):
            return []
        
        start_time = time.time()
        logger.info("Starting search operation")
        
        try:
            cursor = self.get_db_cursor()
            
            query = """
                SELECT metadata_id, Image_Number, Record,
                    given_name, surname, father_name, father_surname,
                    mother_name, mother_surname, gender,
                    city,
                    spouse_name, spouse_surname, spouse_father_name,
                    spouse_father_surname, spouse_mother_name, spouse_mother_surname
                FROM metadata
                WHERE given_name IS NOT NULL 
                   OR surname IS NOT NULL 
                   OR father_name IS NOT NULL
            """
            
            logger.info("Fetching records from database")
            cursor.execute(query)
            all_records = cursor.fetchall()
            print(len(all_records))

            # Pre-compute variations
            given_name_vars = self.get_name_variations(given_name) if given_name else set()
            surname_vars = self.get_name_variations(surname) if surname else set()
            father_name_vars = self.get_name_variations(father_name) if father_name else set()
            
            # Calculate optimal batch size and number of threads
            total_records = len(all_records)
            num_threads = min(8, math.ceil(total_records / 1000))
            batch_size = math.ceil(total_records / num_threads)
            
            # Split records into batches
            record_batches = [
                all_records[i:i + batch_size]
                for i in range(0, total_records, batch_size)
            ]
            
            # Process batches using thread pool
            with ThreadPoolExecutor(max_workers=num_threads) as executor:
                futures = [
                    executor.submit(
                        self.process_record_batch,
                        batch,
                        given_name_vars,
                        surname_vars,
                        father_name_vars,
                        min_similarity
                    )
                    for batch in record_batches
                ]
                
                for future in as_completed(futures):
                    if future.exception():
                        logger.error(f"Thread error: {future.exception()}")
            
            # Collect results from queue
            all_matches = []
            while not self.results_queue.empty():
                matches = self.results_queue.get()
                filtered_matches = [
                    match for match in matches 
                    if match.get('overall_similarity', 0) > 0.8
                ]
                all_matches.extend(filtered_matches)

            # Sort combined results
            all_matches.sort(key=lambda x: x['overall_similarity'], reverse=True)
            
            execution_time = time.time() - start_time
            logger.info(f"Search completed in {execution_time:.2f} seconds. Found {len(all_matches)} total matches")
            
            return all_matches
            
        except Exception as e:
            logger.error(f"Error in search operation: {str(e)}")
            return []
        finally:
            self.close_thread_connection()

def get_match_quality(similarity):
    if similarity >= 0.9: return "Excellent Match"
    if similarity >= 0.8: return "Very Good Match"
    if similarity >= 0.7: return "Good Match"
    if similarity >= 0.6: return "Fair Match"
    return "Partial Match"

def main():
    # Get user input
    print("Enter search criteria (press Enter to skip any field):")
    given_name = input("Given Name: ").strip()
    surname = input("Surname: ").strip()
    father_name = input("Father's Name: ").strip()
    
    # Create search instance
    search_tool = HindiNameSearch()
    
    # Perform search
    matches = search_tool.search_specific_fields(
        given_name=given_name,
        surname=surname,
        father_name=father_name,
        min_similarity=0.7
    )
    
    # Display results
    print("\nSearch Results:")
    print("-" * 80)
    
    for match in matches:
        record = match['record']
        print(f"\nMatch Quality: {get_match_quality(match['overall_similarity'])}")
        print(f"Overall Similarity: {match['overall_similarity']*100:.2f}%")
        print(f"Name: {record['given_name']} {record['surname']}")
        print(f"Father's Name: {record['father_name']} {record['father_surname']}")
        # print(f"City: {record['city']}")
        print(f"Field Scores:")
        for field, score in match['field_scores'].items():
            if score > 0:
                print(f"  - {field}: {score*100:.2f}%")
        print("-" * 80)
    
    print(len(matches))

if __name__ == "__main__":
    main()