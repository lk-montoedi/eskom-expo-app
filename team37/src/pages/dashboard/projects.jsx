import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function Projects() {
    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card className="bg-black border border-blue-800 rounded-lg shadow-lg">
                <CardHeader className="mb-6 p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-black border-b border-blue-700 rounded-t-lg flex flex-row items-center gap-8">
                    <Typography variant="h6" color="white" className="flex-grow">
                        Projects
                    </Typography>
                    <Link
                        to="/dashboard/addProjects"
                        className="ml-auto px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-300"
                    >
                        Add Project
                    </Link>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0 pt-0 pb-4 bg-black border-t border-blue-800 rounded-b-lg">
                    <table className="w-full min-w-[640px] table-auto text-white">
                        <thead>
                            <tr>
                                {["Project ID", "Project Name", "Learner Name", "Project Stand"].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-800 py-3 px-5 text-left text-blue-400 text-xs font-bold uppercase"
                                    >
                                        {el}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            
                                
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}

export default Projects;
