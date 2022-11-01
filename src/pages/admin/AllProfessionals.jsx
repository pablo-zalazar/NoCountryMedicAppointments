import { Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DashboardLayout } from "../../Layouts/dashboard/DashboardLayout";
import { changeActive } from "../../store/slices/user";

const gridStyle = {
  borderRadius: 2,
  border: "1px solid black",
  "& .MuiDataGrid-main": { borderRadius: 2 },
  "& .MuiDataGrid-virtualScrollerRenderZone": {
    "& .MuiDataGrid-row": {
      "&:nth-of-type(2n)": { backgroundColor: "rgba(235, 235, 235, .7)" },
    },
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "rgba(0,0,255,0.6)",
    boder: "1px solid rgba(0,0,255,0.6)",
    color: "#fff",
    fontSize: 16,
    "& * ": {
      color: "#fff",
    },
  },
  "& .MuiDataGrid-columnSeparator": {
    visibility: "hidden",
  },
};

export default function AllProfessionals() {
  const [allProfessionals, setAllProfessional] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProfessionalsList = async () => {
      const { data } = await axios.get(`/api/professionals/allProfessionals`);
      const professionals = data.map((p) => p.professionalRef);

      setAllProfessional(professionals);
    };
    getProfessionalsList();
  }, []);

  //console.log(professionals);

  const handleChangeActive = async (row) => {
    const professional = allProfessionals.filter((p) => p === row)[0];
    await dispatch(changeActive(professional));
    setAllProfessional(
      allProfessionals.map((p) =>
        p !== row ? p : { ...row, isActive: !p.isActive }
      )
    );
  };

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      width: 150,
      renderCell: (params) => <>{params.row.firstName}</>,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      width: 150,
      renderCell: (params) => <>{params.row.lastName}</>,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      width: 150,
      renderCell: (params) => <>{params.row.email}</>,
    },
    {
      field: "speciality",
      headerName: "Speciality",
      flex: 1,
      width: 150,
      renderCell: (params) => <>{params.row.speciality}</>,
    },
    {
      field: "action",
      type: "string",
      sortable: false,
      menubar: false,
      headerName: "Active",
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <>
          {
            <Checkbox
              checked={params.row.isActive}
              onClick={() => handleChangeActive(params.row)}
            />
          }
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      {allProfessionals.length > 0 ? (
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <DataGrid
            disableColumnSelector
            disableSelectionOnClick
            autoHeight
            columns={columns}
            rows={allProfessionals}
            rowsPerPageOptions={[5]}
            pageSize={5}
            getRowId={(row) => row._id}
            sx={gridStyle}
          />
        </div>
      ) : null}
    </DashboardLayout>
  );
}

