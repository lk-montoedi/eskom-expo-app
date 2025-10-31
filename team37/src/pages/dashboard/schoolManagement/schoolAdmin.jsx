import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import AddSchool from "./addSchool";
import UpdateSchool from "./updateSchool";
import DeleteSchool from "./deleteSchool";

export function SchoolAdmin({Role}) {
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const navigate = useNavigate();
    
    // Modal states
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [showAddSchool, setshowAddSchool] = useState(false);
    

    // Fetch schools on component mount
    useEffect(() => {
        fetchSchools();
    }, []);

    // Filter schools based on search term
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredSchools(schools);
        } else {
            const filtered = schools.filter(school => 
                school.schoolname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.schoolid.toString().includes(searchTerm)
            );
            setFilteredSchools(filtered);
        }
    }, [searchTerm, schools]);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/schools');
            if (response.ok) {
                const data = await response.json();
                setSchools(data);
                setFilteredSchools(data);
            } else {
                const errorData = await response.json();
                console.error("Failed to fetch schools:", errorData);
            }
        } catch (error) {
            console.error("Error fetching schools:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSchoolClick = (school) => {
        setSelectedSchool(school);
        setShowDetailsModal(true);
    };

    const handleEditClick = (school, e) => {
        e.stopPropagation();
        setSelectedSchool(school);
        setShowDetailsModal(true);
    };

    const handleAddSchool = () => {
        navigate('/schools/add');
    };

    const handleUpdateSuccess = () => {
        fetchSchools();
        setShowUpdateModal(false);
        setShowDetailsModal(false);
        setSelectedSchool(null);
    };

    const handleEditSchoolFromDetails = () => {
        setShowDetailsModal(false);
        setShowUpdateModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedSchool(null);
    };

   {/* const handleDeleteSuccess = () => {
        fetchSchools();
        setShowDeleteModal(false);
        setSelectedSchool(null);
    };*/}

    const displayedSchools = showAll ? filteredSchools : filteredSchools.slice(0, 10);

    return (
        <>
        
        {showAddSchool?
            (<AddSchool/>)
            :
            (<div className="mt-12 mb-8 flex flex-col gap-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-indigo-200/40 rounded-2xl shadow-xl shadow-indigo-100/30">
                <CardHeader className="mb-0 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl shadow-md">
                    <div className="flex flex-row items-center gap-8">
                        <Typography variant="h6" className="flex-grow text-white font-bold flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m-2 0h2M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
                            </svg>
                            Schools Management
                        </Typography>
                        
                        {/* Search Bar */}
                        <div className="flex-grow max-w-md">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <Input
                                    type="text"
                                    placeholder="Search by School ID or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 bg-white border-indigo-200 focus:border-indigo-400 rounded-xl shadow-sm text-gray-700"
                                    color="indigo"
                                />
                            </div>
                        </div>
                        
                        <Button
                            onClick={() => setshowAddSchool(true)}
                            className="ml-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white rounded-xl font-semibold shadow-xs shadow-green-400 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add School
                        </Button>
                    </div>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0 pt-0 pb-8 bg-white rounded-b-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500 mb-6"></div>
                            <Typography className="text-indigo-600 text-lg font-semibold">
                                Loading schools...
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <div className="w-full min-w-[350px] md:min-w-[700px]">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-100">
                                            {["School ID", "School Name", "Region", "District", "Province", "Actions"].map((el) => (
                                                <th
                                                    key={el}
                                                    className="py-6 px-6 text-left text-indigo-700 text-sm font-bold uppercase tracking-wide"
                                                >
                                                    {el}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedSchools.length > 0 ? (
                                            displayedSchools.map((school, index) => (
                                                <tr
                                                    key={school.schoolid}
                                                    className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 cursor-pointer transition-all duration-200 border-b border-indigo-50 ${
                                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                                    }`}
                                                    onClick={() => handleSchoolClick(school)}
                                                >
                                                    <td className="py-6 px-6">
                                                        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                                                            {school.schoolid}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-700 font-semibold">
                                                            {school.schoolname}
                                                        </Typography>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-600 font-medium">
                                                            {school.region || "N/A"}
                                                        </Typography>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-600 font-medium">
                                                            {school.district || "N/A"}
                                                        </Typography>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-600 font-medium">
                                                            {school.province || "N/A"}
                                                        </Typography>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Button
                                                            size="sm"
                                                            onClick={(e) => handleEditClick(school, e)}
                                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-20">
                                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-3xl max-w-md mx-auto">
                                                        <svg className="w-16 h-16 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m-2 0h2M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
                                                        </svg>
                                                        <Typography className="text-indigo-600 text-lg font-semibold">
                                                            No schools found
                                                        </Typography>
                                                        <Typography className="text-indigo-500 text-sm mt-2">
                                                            Try adjusting your search criteria
                                                        </Typography>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* View All Button */}
                            {filteredSchools.length > 10 && (
                                <div className="flex justify-center mt-8 px-8">
                                    <Button
                                        onClick={() => setShowAll(!showAll)}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        {showAll ? "Show Less" : `View All (${filteredSchools.length} schools)`}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardBody>
            </Card>

            {/* School Details Modal */}
            {selectedSchool && showDetailsModal && (
                <Dialog 
                    open={showDetailsModal} 
                    handler={handleCloseDetailsModal} 
                    className="bg-white/90 backdrop-blur-sm border border-indigo-200/40 rounded-2xl shadow-2xl shadow-indigo-100/40"
                    size="md"
                >
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl border-b border-indigo-200">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m-2 0h2M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
                            </svg>
                            School Details
                        </div>
                    </DialogHeader>
                    <DialogBody className="bg-white text-gray-700 p-6">
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                <Typography variant="small" className="text-indigo-700 font-bold mb-1">School ID:</Typography>
                                <Typography className="text-gray-700 font-semibold text-lg">{selectedSchool.schoolid}</Typography>
                            </div>
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                                <Typography variant="small" className="text-blue-700 font-bold mb-1">School Name:</Typography>
                                <Typography className="text-gray-700 font-semibold text-lg">{selectedSchool.schoolname}</Typography>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-400">
                                    <Typography variant="small" className="text-indigo-700 font-bold mb-1">Region:</Typography>
                                    <Typography className="text-gray-700 font-medium">{selectedSchool.region || "N/A"}</Typography>
                                </div>
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                                    <Typography variant="small" className="text-blue-700 font-bold mb-1">District:</Typography>
                                    <Typography className="text-gray-700 font-medium">{selectedSchool.district || "N/A"}</Typography>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                    <Typography variant="small" className="text-indigo-700 font-bold mb-1">Province:</Typography>
                                    <Typography className="text-gray-700 font-medium">{selectedSchool.province || "N/A"}</Typography>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter className="bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-indigo-200 rounded-b-2xl">
                        <Button
                            variant="text"
                            onClick={handleCloseDetailsModal}
                            className="mr-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors duration-200"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleEditSchoolFromDetails}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105"
                        >
                            Edit School
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}

            {/* Update School Modal */}
            <UpdateSchool
                open={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onSuccess={handleUpdateSuccess}
                school={selectedSchool}
            />

            {/* Delete School Modal */}
           {/* <DeleteSchool
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSuccess={handleDeleteSuccess}
                school={selectedSchool}
            />*/}
        </div>)}</>
    );
}

export default SchoolAdmin;