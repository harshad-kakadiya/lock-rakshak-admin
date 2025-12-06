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
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Link as MuiLink,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { locationService } from '@/services/locationService';

export default function LocationPage() {
    const [locations, setLocations] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [formData, setFormData] = useState({
        link: '',
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        setLoading(true);
        try {
            const data = await locationService.getAll();
            const normalized = (data || []).map((item, index) => ({
                ...item,
                id: item.id ?? item._id ?? index,
            }));
            setLocations(normalized);
        } catch (error) {
            console.error('Error loading locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setEditingLocation(null);
        setFormData({
            link: '',
        });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (location) => {
        setEditingLocation(location);
        setFormData({
            link: location.link ?? '',
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingLocation(null);
        setFormData({
            link: '',
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
        if (!formData.link.trim()) {
            alert('Please enter a location link');
            return;
        }

        // Basic URL validation
        try {
            new URL(formData.link.trim());
        } catch (error) {
            alert('Please enter a valid URL');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                link: formData.link.trim(),
            };
            
            if (editingLocation) {
                await locationService.update(editingLocation.id ?? editingLocation._id, payload);
            } else {
                await locationService.create(payload);
            }
            await loadLocations();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving location:', error);
            alert('Error saving location. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) {
            return;
        }

        setLoading(true);
        try {
            await locationService.delete(id);
            await loadLocations();
        } catch (error) {
            console.error('Error deleting location:', error);
            alert(`Error deleting location: ${error.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)', py: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    mb: { xs: 3, sm: 4 },
                    gap: { xs: 2, sm: 0 }
                }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1e293b', 
                                mb: 0.5,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                            }}
                        >
                            Location Management
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                            Manage location links for your content
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                        sx={{
                            textTransform: 'none',
                            px: { xs: 2, sm: 2.5, md: 3 },
                            py: { xs: 1, sm: 1.25, md: 1.5 },
                            borderRadius: '12px',
                            fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Add Location
                    </Button>
                </Box>

                {loading && locations.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
                    </Box>
                ) : locations.length === 0 ? (
                    <Paper
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            borderRadius: '20px',
                            background: '#ffffff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                    >
                        <LocationOnIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                            No locations yet
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Start by adding your first location link
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            }}
                        >
                            Add Your First Location
                        </Button>
                    </Paper>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            background: '#ffffff',
                        }}
                    >
                        <TableContainer sx={{ overflowX: 'hidden' }}>
                            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, width: '70%' }}>Location Link</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '30%' }} align="right">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {locations.map((location) => (
                                        <TableRow
                                            key={location._id ?? location.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(59, 130, 246, 0.04)',
                                                },
                                            }}
                                        >
                                            <TableCell sx={{ overflow: 'hidden' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                                                    <LocationOnIcon sx={{ color: '#3b82f6', flexShrink: 0 }} />
                                                    <MuiLink
                                                        href={location.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{
                                                            color: '#3b82f6',
                                                            textDecoration: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            minWidth: 0,
                                                            flex: 1,
                                                            '&:hover': {
                                                                textDecoration: 'underline',
                                                            },
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {location.link}
                                                        </Box>
                                                        <OpenInNewIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                                                    </MuiLink>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                    <Tooltip title="Edit location">
                                                        <IconButton
                                                            onClick={() => handleOpenEditDialog(location)}
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
                                                    <Tooltip title="Delete location">
                                                        <IconButton
                                                            onClick={() => handleDelete(location._id ?? location.id)}
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
                )}

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: { xs: '16px', sm: '20px' },
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            m: { xs: 2, sm: 3 },
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: '#ffffff',
                            fontWeight: 600,
                            py: 2.5,
                        }}
                    >
                        {editingLocation ? 'Edit Location' : 'Add New Location'}
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                            <TextField
                                label="Location Link (Google Maps URL)"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                required
                                placeholder="https://www.google.com/maps/..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                                helperText="Enter a valid Google Maps URL or any location link"
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
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : editingLocation ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
