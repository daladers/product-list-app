import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateProduct,
  addComment,
  deleteComment,
} from "../redux/ProductSlice";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Paper,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const ProductView = () => {
  const product = useSelector((state) => state.product.currentProduct);
  const dispatch = useDispatch();
  const [localProduct, setLocalProduct] = useState(product);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (product) {
      setLocalProduct({ ...product });
    }
  }, [product]);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateProduct = () => {
    if (
      localProduct.name &&
      localProduct.count &&
      localProduct.imageUrl &&
      localProduct.size.width &&
      localProduct.size.height &&
      localProduct.weight
    ) {
      dispatch(updateProduct(localProduct));
      closeEditModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "width" || name === "height") {
      setLocalProduct({
        ...localProduct,
        size: {
          ...localProduct.size,
          [name]: parseInt(value),
        },
      });
    } else if (name === "count") {
      setLocalProduct({
        ...localProduct,
        [name]: parseInt(value) < 0 ? 0 : parseInt(value),
      });
    } else {
      setLocalProduct({
        ...localProduct,
        [name]: value,
      });
    }
  };

  const handleAddComment = () => {
    if (newComment && localProduct.id) {
      const comment = {
        description: newComment,
        date: new Date().toLocaleString(),
      };
      dispatch(addComment({ productId: localProduct.id, comment }));
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ productId: localProduct.id, commentId }))
      .unwrap()
      .then(() => {
        setLocalProduct(prevProduct => ({
          ...prevProduct,
          comments: prevProduct.comments.filter(c => c._id !== commentId)
        }));
      })
      .catch(error => {
        console.error("Failed to delete comment:", error);
      });
  };

  if (!localProduct) return <Typography>No product selected</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <img
            src={localProduct.imageUrl}
            alt={localProduct.name}
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">{localProduct.name}</Typography>
          <Typography variant="body1">Count: {localProduct.count}</Typography>
          <Typography variant="body1">
            Size: {localProduct.size.width} x {localProduct.size.height}
          </Typography>
          <Typography variant="body1">Weight: {localProduct.weight}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={openEditModal}
            sx={{ mt: 2 }}
          >
            Edit
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="product tabs">
          <Tab label="Comments" />
          <Tab label="Add Comment" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {localProduct.comments.map((comment) => (
            <ListItem
              key={comment._id}
              alignItems="flex-start"
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment._id)}>
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                borderBottom: '1px solid #e0e0e0',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <ListItemText
                primary={comment.description}
                secondary={comment.date}
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TextField
          label="Add Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleAddComment}>
          Add Comment
        </Button>
      </TabPanel>


      <Modal open={isEditModalOpen} onClose={closeEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 400,
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Edit Product</Typography>
          <TextField
            label="Product Name"
            name="name"
            value={localProduct.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product Count"
            name="count"
            type="number"
            value={localProduct.count}
            onChange={handleInputChange}
            inputProps={{ min: 0 }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={localProduct.imageUrl}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Width"
            name="width"
            type="number"
            value={localProduct.size.width}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Height"
            name="height"
            type="number"
            value={localProduct.size.height}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Weight"
            name="weight"
            value={localProduct.weight}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProduct}
              sx={{ mt: 2 }}
            >
              Update
            </Button>
            <Button variant="outlined" onClick={closeEditModal} sx={{ mt: 1 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      </Paper>
  );
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };
  
export default ProductView;
