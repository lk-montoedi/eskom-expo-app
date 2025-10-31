import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { DashboardNavbar } from "@/widgets/layout";

function AddSchool() {
    const [formData, setFormData] = useState({
        schoolname: "",
        region: "",
        district: "",
        province: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        setLoading(true);
        try {
            const response = await fetch("/api/schools", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                alert("School created successfully!");
                navigate("/schools");
            } else {
                const error = await response.json();
                alert(error.message || "Failed to create school");
            }
        } catch (error) {
            console.error("Error creating school:", error);
            alert("Error creating school. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
          
            <div className="max-w-2xl mx-auto px-4">
                {/* Header with back button */}
                <div className="mb-6">
                    <Button
                        variant="text"
                        color="blue"
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-blue-700 hover:bg-blue-50 mb-4"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Dashboard
                     
                    </Button>
                    <Typography variant="h3" className="text-gray-800 font-bold">
                        Add New School
                    </Typography>
                    <Typography variant="small" className="text-gray-600 mt-1">
                        Fill in the details below to create a new school record
                    </Typography>
                </div>

                {/* Main form card */}
                <Card className="bg-gray-50 border border-blue-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-6">
                        <Typography variant="h5" className="text-white">
                            School Information
                        </Typography>
                    </CardHeader>
                    
                    <CardBody className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Typography variant="small" className="text-blue-700 font-semibold mb-2">
                                    School Name *
                                </Typography>
                                <Input
                                    name="schoolname"
                                    type="text"
                                    placeholder="Enter school name"
                                    value={formData.schoolname}
                                    onChange={handleChange}
                                    className="bg-white text-gray-800 border-blue-300 focus:border-blue-500"
                                    color="blue"
                                    required
                                />
                            </div>

                            <div>
                                <Typography variant="small" className="text-blue-700 font-semibold mb-2">
                                    Region
                                </Typography>
                                <Input
                                    name="region"
                                    type="text"
                                    placeholder="Enter region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    className="bg-white text-gray-800 border-blue-300 focus:border-blue-500"
                                    color="blue"
                                />
                            </div>

                            <div>
                                <Typography variant="small" className="text-blue-700 font-semibold mb-2">
                                    District
                                </Typography>
                                <Input
                                    name="district"
                                    type="text"
                                    placeholder="Enter district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="bg-white text-gray-800 border-blue-300 focus:border-blue-500"
                                    color="blue"
                                />
                            </div>

                            <div>
                                <Typography variant="small" className="text-blue-700 font-semibold mb-2">
                                    Province
                                </Typography>
                                <Select
                                    value={formData.province}
                                    onChange={handleSelectChange}
                                    className="bg-white text-gray-800 border-blue-300 focus:border-blue-500"
                                    color="blue"
                                >
                                    <Option value="">Select a province</Option>
                                    {provinces.map((province) => (
                                        <Option key={province} value={province}>
                                            {province}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-blue-200">
                                <Button
                                    variant="outlined"
                                    color="blue"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="border-blue-600 text-blue-700 hover:bg-blue-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    color="blue"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {loading ? "Creating..." : "Create School"}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default AddSchool;