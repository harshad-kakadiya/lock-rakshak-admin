'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
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
                <Card
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        borderRadius: '20px',
                        background: '#ffffff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                >
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
                </Card>
            );
        }

        return (
            <Grid container spacing={3}>
                {personDetails.map((person) => (
                    <Grid item xs={12} sm={6} md={4} key={person.id || person._id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '20px',
                                background: '#ffffff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    height: 200,
                                    background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 80, color: '#ffffff' }} />
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                {person.phone && (
                                    <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                                        📞 {person.phone}
                                    </Typography>
                                )}
                                {person.address && (
                                    <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                                        📍 {person.address}
                                    </Typography>
                                )}
                                {person.email && (
                                    <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                                        📧 {person.email}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
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
                                <IconButton
                                    onClick={(e) => handleDelete(person.id || person._id, e)}
                                    sx={{
                                        color: '#ef4444',
                                        '&:hover': {
                                            backgroundColor: 'rgba(239,68,68,0.1)',
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
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

                {renderContent()}
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

