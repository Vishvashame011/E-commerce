import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TablePagination,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { Delete, Edit, People, AdminPanelSettings } from '@mui/icons-material';
import api from '../config/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/users?page=${page}&size=${rowsPerPage}`);
      setUsers(response.data.content);
      setTotalUsers(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpenDialog(true);
  };

  const updateUserRole = async () => {
    try {
      await api.put(`/admin/users/${selectedUser.id}/role?role=${newRole}`);
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <People sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            User Management
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#718096' }}>
          Manage user accounts and permissions
        </Typography>
      </Box>

      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)'
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} sx={{ 
                    '&:hover': { 
                      bgcolor: '#f7fafc',
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease'
                    },
                    borderBottom: index === users.length - 1 ? 'none' : '1px solid #e2e8f0'
                  }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          mr: 2, 
                          bgcolor: user.role === 'ADMIN' ? '#f56565' : '#4299e1',
                          width: 40,
                          height: 40
                        }}>
                          {user.role === 'ADMIN' ? 
                            <AdminPanelSettings sx={{ fontSize: 20 }} /> : 
                            user.username.charAt(0).toUpperCase()
                          }
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2d3748' }}>
                            {user.username}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#718096' }}>
                            {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No name'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>
                        {user.email}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        ID: {user.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={user.role === 'ADMIN' ? 'error' : 'primary'}
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          borderRadius: 2
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.emailVerified ? 'Verified' : 'Unverified'} 
                        color={user.emailVerified ? 'success' : 'warning'}
                        size="small"
                        sx={{ 
                          fontWeight: 'medium',
                          borderRadius: 2
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          startIcon={<Edit />}
                          onClick={() => handleRoleChange(user)}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'medium'
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<Delete />}
                          onClick={() => deleteUser(user.id)}
                          color="error"
                          size="small"
                          variant="outlined"
                          disabled={user.role === 'ADMIN'}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'medium'
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                borderTop: '1px solid #e2e8f0',
                bgcolor: '#f7fafc'
              }}
            />
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Update User Role
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Role"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={updateUserRole} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;