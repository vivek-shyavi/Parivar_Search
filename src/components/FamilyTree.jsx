// export default FamilyTree;

import React, { useState, useEffect } from 'react';
import { User, Users, ArrowLeft, UserCircle, Home, Users2 } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import OtpVerificationDialog from './OtpVerificationDialog';
import { BASE_URL } from '../config/api.config';

// New components from the second implementation
const FamilyPhotoCard = ({ name, relationship, photoUrl }) => (
  <div className="transform transition-all duration-300 hover:scale-105">
    <div className="bg-gradient-to-br from-teal-50 to-orange-50 rounded-lg p-2 shadow-md border border-orange-200 w-32">
      <div className="mb-2">
        <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border-2 border-orange-200 shadow-inner">
          {photoUrl ? (
            <img
              src={photoUrl || "/api/placeholder/80/80"}
              alt={name}
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-100 to-orange-100 flex items-center justify-center">
              <User className="w-8 h-8 text-orange-400" />
            </div>
          )}
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="font-medium text-sm text-gray-800 px-1 py-0.5 rounded-md bg-white/50">
          {name}
        </h3>
        <span className="inline-block text-xs text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
          {relationship}
        </span>
      </div>
    </div>
  </div>
);

const TreeConnector = ({ parentWidth, childrenPositions }) => {
  if (!childrenPositions?.length) return null;

  const leftMostChild = childrenPositions[0];
  const rightMostChild = childrenPositions[childrenPositions.length - 1];
  const isSingleChild = childrenPositions.length === 1;

  return (
    <div className="relative w-full h-16">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          width={parentWidth}
          height="64"
          className="absolute"
        >
          <defs>
            <marker
              id="arrow-marker"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb923c"/>
            </marker>
          </defs>

          <line
            x1={parentWidth / 2}
            y1="0"
            x2={parentWidth / 2}
            y2={isSingleChild ? "60" : "24"}
            stroke="#fb923c"
            strokeWidth="2"
            markerEnd={isSingleChild ? "url(#arrow-marker)" : ''}
          />

          {!isSingleChild && (
            <line
              x1={leftMostChild}
              y1="24"
              x2={rightMostChild}
              y2="24"
              stroke="#fb923c"
              strokeWidth="2"
            />
          )}

          {childrenPositions.map((pos, index) => (
            <line
              key={index}
              x1={pos}
              y1="24"
              x2={pos}
              y2="60"
              stroke="#fb923c"
              strokeWidth="2"
              markerEnd="url(#arrow-marker)"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

const calculateChildPositions = (node, level = 0, baseSpacing = 160) => {
  if (!node) return { width: 0, positions: [] };

  if (!node.children?.length) {
    return { width: baseSpacing, positions: [] };
  }

  const childrenInfo = node.children.map(child => 
    calculateChildPositions(child, level + 1, baseSpacing)
  );

  const totalChildrenWidth = childrenInfo.reduce((sum, info) => sum + info.width, 0);
  
  let currentPosition = 0;
  const childPositions = childrenInfo.map(info => {
    const pos = currentPosition + (info.width / 2);
    currentPosition += info.width;
    return pos;
  });

  return {
    width: Math.max(baseSpacing, totalChildrenWidth),
    positions: childPositions,
    childrenInfo
  };
};

const TreeNode = ({ node, level = 0 }) => {
  if (!node) return null;

  const treeLayout = calculateChildPositions(node, level);
  const nodeWidth = Math.max(128, treeLayout.width);

  return (
    <div 
      className="relative flex flex-col items-center animate-fadeIn"
      style={{ width: `${nodeWidth}px` }}
    >
      <FamilyPhotoCard
        name={node.name}
        relationship={node.relationship}
        photoUrl={node.photoUrl}
      />

      {node.children?.length > 0 && (
        <>
          <TreeConnector
            parentWidth={nodeWidth}
            childrenPositions={treeLayout.positions}
          />
          <div 
            className="flex justify-between w-full"
            style={{ width: `${treeLayout.width}px` }}
          >
            {node.children.map((child, index) => (
              <div
                key={index}
                style={{ width: `${treeLayout.childrenInfo[index].width}px` }}
              >
                <TreeNode node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const FamilyTree = () => {
  const [data, setData] = useState({ treeData: null, personDetails: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [panditDetails, setPanditDetails] = useState(null);
  const navigate = useNavigate();
  const { metadataId } = useParams();
  const location = useLocation();
  const { searchResults, searchParams, currentPage } = location.state || {};

  useEffect(() => {
    fetchFamilyTree();
  }, [metadataId]);

  const fetchFamilyTree = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/family-tree/${metadataId}`
      );

      if (!response.ok) throw new Error('Failed to fetch family tree');

      const result = await response.json();
      setData({
        treeData: result.tree_data,
        personDetails: result.person_details
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerificationSuccess = async () => {
    try {
      // console.log("user_id :",user_id)
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('No user ID found');
      }
  
      const response = await fetch(
        `${BASE_URL}/pandit-details/${metadataId}`,
        {
          headers: {
            'Authorization': `Bearer ${userId}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pandit details');
      }
  
      const result = await response.json();
      setPanditDetails(result);
    } catch (err) {
      console.error('Error fetching pandit details:', err);
    }
  };

  const renderPersonDetails = () => {
    const person = data.personDetails;
    if (!person) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <UserCircle className="w-6 h-6 mr-2 text-orange-600" />
          Person Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-orange-600" />
              Personal Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Given Name: <span className="font-medium text-gray-900">{person.given_name || '-'}</span></p>
              <p className="text-sm text-gray-600">Surname: <span className="font-medium text-gray-900">{person.surname || '-'}</span></p>
              <p className="text-sm text-gray-600">Relationship: <span className="font-medium text-gray-900">{person.relationship || '-'}</span></p>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Users2 className="w-4 h-4 mr-2 text-orange-600" />
              Family Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Father: <span className="font-medium text-gray-900">{person.father_name || '-'}</span></p>
              <p className="text-sm text-gray-600">Mother: <span className="font-medium text-gray-900">{person.mother_name || '-'}</span></p>
              <p className="text-sm text-gray-600">Spouse: <span className="font-medium text-gray-900">{person.spouse_name || '-'}</span></p>
            </div>
          </div>

          {/* Record Information */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Home className="w-4 h-4 mr-2 text-orange-600" />
              Location
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">City: <span className="font-medium text-gray-900">{person.city || '-'}</span></p>
              <p className="text-sm text-gray-600">Record Number: <span className="font-medium text-gray-900">{person.record || '-'}</span></p>
              <p className="text-sm text-gray-600">Image Number: <span className="font-medium text-gray-900">{person.image_number || '-'}</span></p>
              {/* <p className="text-sm text-gray-600">metadata id: <span className="font-medium text-gray-900">{person.metadata_id || '-'}</span></p> */}
            </div>
          </div>

          {/* OTP Verification and Pandit Details */}
          <div className="col-span-3">
          {!panditDetails ? (
      <OtpVerificationDialog onVerificationSuccess={handleOtpVerificationSuccess} />
    ) : (
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <User className="w-4 h-4 mr-2 text-orange-600" />
          Pandit Details
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Pandit Name: <span className="font-medium text-gray-900">{panditDetails.name || '-'}</span></p>
          <p className="text-sm text-gray-600">Contact Number: <span className="font-medium text-gray-900">{panditDetails.contact_info || '-'}</span></p>
          <p className="text-sm text-gray-600">Location: <span className="font-medium text-gray-900">{panditDetails.location || '-'}</span></p>
        </div>
      </div>
    )}
          </div>
        </div>
      </div>
    );
  };

  // Add the fadeIn animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      .overflow-x-auto { scroll-behavior: smooth; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() =>
              navigate(-1, {
                state: { searchResults, searchParams, currentPage },
              })
            }
            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm text-gray-700 hover:text-orange-600 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Search Results</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-3 border-orange-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading information...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {renderPersonDetails()}
            
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-orange-100">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Family Tree</h1>
              </div>

              {data.treeData && (
                <div className="overflow-x-auto">
                  <div className="min-w-max p-4 flex justify-center">
                    <TreeNode node={data.treeData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree;