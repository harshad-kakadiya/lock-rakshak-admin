'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    CircularProgress,
    Alert,
    Collapse,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { personDetailService } from '@/services/personDetailService';

export default function PersonDetailPage() {
    const [personDetails, setPersonDetails] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    React.useEffect(() => {
        loadPersonDetails();
    }, []);

    const loadPersonDetails = async () => {
        setLoading(true);
        try {
            const data = await personDetailService.getAll();
            setPersonDetails(data);
        } catch (error) {
            console.error('Error loading person details:', error);
            setFeedback({
                type: 'error',
                message: error.message || 'Failed to fetch person details',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setEditingPerson(null);
        setFormData({
            phone: '',
            address: '',
            email: '',
        });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (person) => {
        setEditingPerson(person);
        setFormData({
            phone: person.phone || '',
            address: person.address || '',
            email: person.email || '',
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPerson(null);
        setFormData({
            phone: '',
            address: '',
            email: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async () => {
        if (!formData.phone || !formData.address || !formData.email) {
            setFeedback({
                type: 'error',
                message: 'Please fill in all required fields: Phone, Address, and Email',
            });
            return;
        }

        setLoading(true);
        try {
            if (editingPerson) {
                await personDetailService.update(editingPerson.id || editingPerson._id, formData);
                setFeedback({ type: 'success', message: 'Person detail updated successfully' });
            } else {
                await personDetailService.create(formData);
                setFeedback({ type: 'success', message: 'Person detail added successfully' });
            }
            await loadPersonDetails();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving person detail:', error);
            setFeedback({
                type: 'error',
                message: error.message || 'Error saving person detail. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this person detail?')) {
            return;
        }
        setLoading(true);
        try {
            await personDetailService.delete(id);
            setFeedback({ type: 'success', message: 'Person detail deleted successfully' });
            await loadPersonDetails();
        } catch (error) {
            console.error('Error deleting person detail:', error);
            setFeedback({
                type: 'error',
                message: error.message || 'Error deleting person detail. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading && personDetails.length === 0) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress size={60} sx={{ color: '#8b5cf6' }} />
                </Box>
            );
        }

        if (!personDetails.length) {
            return (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <PersonIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                        No person details yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Start by adding your first person detail
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                        }}
                    >
                        Add Your First Person Detail
                    </Button>
                </Box>
            );
        }

        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    background: '#ffffff',
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {personDetails.map((person) => (
                                <TableRow
                                    key={person.id || person._id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(167, 139, 250, 0.04)',
                                        },
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#475569' }}>
                                            {person.phone || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#475569' }}>
                                            {person.address || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#475569' }}>
                                            {person.email || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Tooltip title="Edit person detail">
                                                <IconButton
                                                    onClick={() => handleOpenEditDialog(person)}
                                                    sx={{
                                                        color: '#6366f1',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete person detail">
                                                <IconButton
                                                    onClick={(e) => handleDelete(person.id || person._id, e)}
                                                    sx={{
                                                        color: '#ef4444',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        );
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)', py: 4 }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}
                        >
                            Person Detail Management
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Manage and organize person details and information
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                        sx={{
                            textTransform: 'none',
                            px: 3,
                            py: 1.5,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                            boxShadow: '0 4px 15px rgba(167, 139, 250, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                boxShadow: '0 6px 20px rgba(167, 139, 250, 0.5)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Add Person Detail
                    </Button>
                </Box>

                <Collapse in={Boolean(feedback.message)}>
                    {feedback.message && (
                        <Alert
                            severity={feedback.type || 'info'}
                            onClose={() => setFeedback({ type: '', message: '' })}
                            sx={{ mb: 3, borderRadius: '12px' }}
                        >
                            {feedback.message}
                        </Alert>
                    )}
                </Collapse>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        background: '#ffffff',
                    }}
                >
                    {renderContent()}
                </Paper>
            </Container>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        py: 2.5,
                    }}
                >
                    {editingPerson ? 'Edit Person Detail' : 'Add New Person Detail'}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <TextField
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            variant="outlined"
                            helperText="Enter the phone number for this person"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />
                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            variant="outlined"
                            helperText="Enter the address for this person"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            variant="outlined"
                            placeholder="example@email.com"
                            helperText="Enter the email address for this person"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 3,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 3,
                            background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : editingPerson ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

