import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import PostManagement from '../components/admin/PostManagement';
import UserManagement from '../components/admin/UserManagement';
import PostAdmin from '../components/admin/PostAdmin';
import UserAdmin from '../components/admin/UserAdmin';
import { FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage: React.FC = () => {
  // const [tabValue, setTabValue] = useState(0);

  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue);
  // };

  // return (
  //   <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
  //     <Paper sx={{ width: '100%', mb: 2 }}>
  //       <Tabs
  //         value={tabValue}
  //         onChange={handleTabChange}
  //         indicatorColor="primary"
  //         textColor="primary"
  //         variant="fullWidth"
  //         sx={{ borderBottom: 1, borderColor: 'divider' }}
  //       >
  //         <Tab label="Quản lý bài viết" />
  //         <Tab label="Quản lý người dùng" />
  //       </Tabs>

  //       <TabPanel value={tabValue} index={0}>
  //         <PostManagement />
  //       </TabPanel>
  //       <TabPanel value={tabValue} index={1}>
  //         <UserManagement />
  //       </TabPanel>
  //     </Paper>
  //   </Box>
  // );
  const tabAdmin = [
          { key: "post", label: "Quản lí bài viết" },
          { key: "user", label: "Quản lí người dùng" }
      ];
      const [activeTab, setActiveTab] = useState("post");
      
      return (
          <div className="flex flex-row h-screen mt-3">
              <div className="flex flex-col w-[300px] gap-3 p-4 bg-gray-200">
                  
                  {tabAdmin.map((tab) => (
                      <button
                          key={tab.key}
                          className={`p-3 flex justify-start items-center mt-1 mb-1 rounded-lg font-semibold transition-colors duration-200 hover:bg-gray-300 ${
                              activeTab === tab.key
                                  ? "bg-blue-200 text-blue-600"
                                  : "text-gray-600 hover:text-blue-500"
                          }`}
                          onClick={() => setActiveTab(tab.key)}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>
              <div className="flex flex-col gap-3 p-4 w-screen">
                  {/* Nội dung tab sẽ được hiển thị ở đây */}
                  {activeTab === "post" && <PostAdmin/>}
                  {activeTab === "user" && <UserAdmin/>}
              </div>
          </div>
      );
};

export default AdminPage; 