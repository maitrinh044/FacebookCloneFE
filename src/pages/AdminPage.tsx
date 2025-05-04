import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import PostManagement from '../components/admin/PostManagement';
import UserManagement from '../components/admin/UserManagement';

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
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Quản lý bài viết" />
          <Tab label="Quản lý người dùng" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <PostManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UserManagement />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminPage; 