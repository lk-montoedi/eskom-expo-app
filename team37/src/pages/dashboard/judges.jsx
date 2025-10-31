import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";

export function Judges() {
    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card className="bg-black border border-blue-800 rounded-lg shadow-lg">
                <CardHeader className="mb-6 p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-black border-b border-blue-700 rounded-t-lg flex items-center">
                    <Typography variant="h6" color="white" className="flex-grow">
                        Judges
                    </Typography>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0 pt-0 pb-4 bg-black border-t border-blue-800 rounded-b-lg">
                    <table className="w-full min-w-[640px] table-auto text-white">
                        <thead>
                            <tr>
                                {["Code", "Judge Name", "Years of Experience", ""].map((el) => (
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

export default Judges;
