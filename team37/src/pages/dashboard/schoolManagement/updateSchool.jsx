import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";

export function UpdateSchool({ open, onClose, onSuccess, school }) {
    const [formData, setFormData] = useState({
        schoolname: "",
        region: "",
        district: "",
        province: "",
    });
    const [loading, setLoading] = useState(false);

    const provinces = [
        "Eastern Cape",
        "Free State",
        "Gauteng",
        "KwaZulu-Natal",
        "Limpopo",
        "Mpumalanga",
        "Northern Cape",
        "North West",
        "Western Cape"
    ];

    // Update form data when school prop changes
    useEffect(() => {
        if (school) {
            setFormData({
                schoolname: school.schoolname || "",
                region: school.region || "",
                district: school.district || "",
                province: school.province || "",
            });
        }
    }, [school]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({
            ...prev,
            province: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.schoolname.trim()) {
            alert("School name is required");
            return;
        }

        if (!school || !school.schoolid) {
            alert("School ID is missing");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/schools/${school.schoolid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                alert("School updated successfully!");
                onSuccess();
            } else {
                const error = await response.json();
                alert(error.message || "Failed to update school");
            }
        } catch (error) {
            console.error("Error updating school:", error);
            alert("Error updating school. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            schoolname: "",
            region: "",
            district: "",
            province: "",
        });
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            handler={handleClose} 
            className="bg-white border-2 border-indigo-300 rounded-xl shadow-2xl" 
            size="md"
        >
            <DialogHeader className="text-indigo-800 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-xl border-b border-indigo-200 py-4">
                <Typography variant="h5" className="text-indigo-800 font-bold">
                    Update School Information
                </Typography>
            </DialogHeader>
            
            <DialogBody className="bg-gradient-to-br from-white to-blue-50 text-gray-700 p-4">
                {school && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                        <Typography variant="small" className="text-indigo-700 font-bold">
                            Editing School ID: <span className="text-purple-700 font-bold">{school.schoolid}</span>
                        </Typography>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-cyan-200">
                        <Typography variant="small" className="text-cyan-700 font-bold mb-2">
                            School Name *
                        </Typography>
                        <Input
                            name="schoolname"
                            type="text"
                            placeholder="Enter school name"
                            value={formData.schoolname}
                            onChange={handleChange}
                            className="bg-white text-gray-700 border-cyan-300 focus:border-cyan-500 rounded-lg shadow-sm"
                            color="cyan"
                            required
                        />
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-cyan-200">
                        <Typography variant="small" className="text-cyan-700 font-bold mb-2">
                            Region
                        </Typography>
                        <Input
                            name="region"
                            type="text"
                            placeholder="Enter region"
                            value={formData.region}
                            onChange={handleChange}
                            className="bg-white text-gray-700 border-cyan-300 focus:border-cyan-500 rounded-lg shadow-sm"
                            color="cyan"
                        />
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-cyan-200">
                        <Typography variant="small" className="text-cyan-700 font-bold mb-2">
                            District
                        </Typography>
                        <Input
                            name="district"
                            type="text"
                            placeholder="Enter district"
                            value={formData.district}
                            onChange={handleChange}
                            className="bg-white text-gray-700 border-cyan-300 focus:border-cyan-500 rounded-lg shadow-sm"
                            color="cyan"
                        />
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-cyan-200">
                        <Typography variant="small" className="text-cyan-700 font-bold mb-2">
                            Province
                        </Typography>
                        <Select
                            value={formData.province}
                            onChange={handleSelectChange}
                            className="bg-white text-gray-700 border-cyan-300 focus:border-cyan-500 rounded-lg shadow-sm"
                        >
                            <Option value="" className="text-gray-500">Select a province</Option>
                            {provinces.map((province) => (
                                <Option key={province} value={province} className="text-gray-700 hover:bg-amber-50">
                                    {province}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </form>
            </DialogBody>
            
            <DialogFooter className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-indigo-200 rounded-b-xl p-4">
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    className="mr-3 border border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                        </span>
                    ) : (
                        "Update School"
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

export default UpdateSchool;