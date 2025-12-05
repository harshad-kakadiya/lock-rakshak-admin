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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { categoryService } from '@/services/categoryService';

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        categoryname: '',
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            const normalized = (data || []).map((item, index) => ({
                ...item,
                id: item.id ?? item._id ?? index,
            }));
            setCategories(normalized);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setEditingCategory(null);
        setFormData({
            categoryname: '',
        });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (category) => {
        setEditingCategory(category);
        setFormData({
            categoryname: category.categoryname ?? category.name ?? category.title ?? '',
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCategory(null);
        setFormData({
            categoryname: '',
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
        if (!formData.categoryname.trim()) {
            alert('Please enter a category name');
            return;
        }

        setLoading(true);
        try {
            // Send payload with categoryname field matching the schema
            const payload = {
                categoryname: formData.categoryname.trim(),
            };
            
            if (editingCategory) {
                await categoryService.update(editingCategory.id ?? editingCategory._id, payload);
            } else {
                await categoryService.create(payload);
            }
            await loadCategories();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        setLoading(true);
        try {
            await categoryService.delete(id);
            await loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(`Error deleting category: ${error.message || 'Please try again.'}`);
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
                            Category Management
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                            Create and manage categories for organizing content
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
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                boxShadow: '0 6px 20px rgba(251, 191, 36, 0.5)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Add Category
                    </Button>
                </Box>

                {loading && categories.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress size={60} sx={{ color: '#f59e0b' }} />
                    </Box>
                ) : categories.length === 0 ? (
                    <Paper
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            borderRadius: '20px',
                            background: '#ffffff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                    >
                        <CategoryIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                            No categories yet
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Start by creating your first category
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            }}
                        >
                            Add Your First Category
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
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Category Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }} align="right">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow
                                            key={category._id ?? category.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(251, 191, 36, 0.04)',
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <CategoryIcon sx={{ color: '#f59e0b' }} />
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {category.categoryname ?? category.name ?? category.title ?? 'Unnamed Category'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                    <Tooltip title="Edit category">
                                                        <IconButton
                                                            onClick={() => handleOpenEditDialog(category)}
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
                                                    <Tooltip title="Delete category">
                                                        <IconButton
                                                            onClick={() => handleDelete(category._id ?? category.id)}
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
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            color: '#ffffff',
                            fontWeight: 600,
                            py: 2.5,
                        }}
                    >
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                            <TextField
                                label="Category Name"
                                name="categoryname"
                                value={formData.categoryname}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                required
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
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : editingCategory ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
