import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Button,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function Users(){
    const navigate = useNavigate();

    return(
        <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6">
          
          <div className="mb-1 flex flex-row gap-20">
              <Typography variant="h6" color="white">
              User Management
              </Typography>

              <div className="">
                <select
                  className="p-1 rounded-lg border bg-gray-600 border-t-blue-gray-200 focus:border-t-gray-900 focus:outline-none"
                >
                  <option value="">Select a type</option>
                  <option value="district">LEARNER</option>
                  <option value="regional">TEACHER</option>
                  <option value="international">JUDGE</option>
                  <option value="international">CONVENOR</option>
                </select>
              </div>

              <div className="">
                <select
                  className=" w-full p-1 rounded-lg border  bg-gray-600 border-t-blue-gray-200 focus:border-t-gray-900 focus:outline-none"
                >
                    <option value="">Select a Category</option>
                    <option value="AGRICULTURAL SCIENCES">AGRICULTURAL SCIENCES(AGR)</option>
                    <option value="ANIMAL SCIENCES">ANIMAL SCIENCES(ANI)</option>
                    <option value="BIOMEDICAL AND MEDICAL SCIENCES">BIOMEDICAL AND MEDICAL SCIENCES(BIO)</option>
                    <option value="CHEMISTRY AND BIOCHEMISTRY">CHEMISTRY AND BIOCHEMISTRY(CHB)</option>
                    <option value="COMPUTER SCIENCES AND SOFTWARE DEVELOPMENT">COMPUTER SCIENCES AND SOFTWARE DEVELOPMENT(COM)</option>
                    <option value="EARTH SCIENCES">EARTH SCIENCES(EAR)</option>
                    <option value="ENERGY">ENERGY(ENP)</option>
                    <option value="ENGINEERING">ENGINEERING(ENG)</option>
                    <option value="ENVIRONMENTAL STUDIES">ENVIRONMENTAL STUDIES(EVS)</option>
                    <option value="MATHEMATICS">MATHEMATICS(MAT)</option>
                    <option value="PLANT SCIENCES">PLANT SCIENCES(PLA)</option>
                    <option value="PHYSICS, ASTRONOMY & SPACE SCIENCES">PHYSICS, ASTRONOMY & SPACE SCIENCES(PHY)</option>
                    <option value="SOCIAL SCIENCES">SOCIAL SCIENCES(SOC)</option>
                </select>
              </div>


          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["user id", "user name", "category", "type", "email" ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
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
    )

}

export default Users;