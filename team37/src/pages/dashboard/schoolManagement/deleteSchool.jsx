import React, { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";

export function DeleteSchool({ open, onClose, onSuccess, school }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!school || !school.schoolid) {
            alert("School ID is missing");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/schools/${school.schoolid}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const result = await response.json();
                alert("School deleted successfully!");
                onSuccess();
            } else {
                const error = await response.json();
                alert(error.message || "Failed to delete school");
            }
        } catch (error) {
            console.error("Error deleting school:", error);
            alert("Error deleting school. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} handler={onClose} className="bg-black border border-red-800" size="md">
            <DialogHeader className="text-white bg-gradient-to-r from-red-900 to-red-700 rounded-t-lg">
                <Typography variant="h5" className="text-white">
                    Delete School
                </Typography>
            </DialogHeader>
            
            <DialogBody className="bg-black text-white p-6">
                <div className="text-center">
                    <div className="mb-4 p-4 bg-red-900/30 rounded-lg border border-red-700">
                        <Typography variant="h6" className="text-red-400 mb-2">
                            ⚠️ Warning
                        </Typography>
                        <Typography className="text-white">
                            This action cannot be undone. Are you sure you want to delete this school?
                        </Typography>
                    </div>
                    
                    {school && (
                        <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                            <Typography variant="small" className="text-blue-400 font-semibold">
                                School Details:
                            </Typography>
                            <div className="mt-2 space-y-1">
                                <Typography className="text-white">
                                    <span className="text-blue-400">ID:</span> {school.schoolid}
                                </Typography>
                                <Typography className="text-white">
                                    <span className="text-blue-400">Name:</span> {school.schoolname}
                                </Typography>
                                {school.region && (
                                    <Typography className="text-white">
                                        <span className="text-blue-400">Region:</span> {school.region}
                                    </Typography>
                                )}
                                {school.district && (
                                    <Typography className="text-white">
                                        <span className="text-blue-400">District:</span> {school.district}
                                    </Typography>
                                )}
                                {school.province && (
                                    <Typography className="text-white">
                                        <span className="text-blue-400">Province:</span> {school.province}
                                    </Typography>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogBody>
            
            <DialogFooter className="bg-black border-t border-red-800 rounded-b-lg">
                <Button
                    variant="text"
                    color="gray"
                    onClick={onClose}
                    className="mr-2"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="gradient"
                    color="red"
                    onClick={handleDelete}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700"
                >
                    {loading ? "Deleting..." : "Delete School"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

export default DeleteSchool;