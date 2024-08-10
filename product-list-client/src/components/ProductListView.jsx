import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  setCurrentProduct,
} from "../redux/ProductSlice";
import {
  Button,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material";
import AddProductModal from "./AddProductModal";
import { useNavigate } from "react-router-dom";

const ProductListView = () => {
  const { products, status, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sortOption, setSortOption] = useState("nameAsc");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDeleteProduct = () => {
    if (productToDelete && productToDelete.id) {
      dispatch(deleteProduct(productToDelete.id));
      closeDeleteModal();
    }
  };

  const viewProductDetails = (product) => {
    dispatch(setCurrentProduct(product));
    navigate("/product");
  };

  const sortedProducts = useMemo(() => {
    if (products.length < 2) {
      return products;
    }

    let sorted = [...products];
    switch (sortOption) {
      case "nameAsc":
        return sorted.sort(
          (a, b) =>
            (a.name || "").localeCompare(b.name || "") || a.count - b.count
        );
      case "nameDesc":
        return sorted.sort(
          (a, b) =>
            (b.name || "").localeCompare(a.name || "") || a.count - b.count
        );
      case "countAsc":
        return sorted.sort(
          (a, b) =>
            a.count - b.count || (a.name || "").localeCompare(b.name || "")
        );
      case "countDesc":
        return sorted.sort(
          (a, b) =>
            b.count - a.count || (a.name || "").localeCompare(b.name || "")
        );
      default:
        return sorted;
    }
  }, [products, sortOption]);

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={openAddModal}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>
      <AddProductModal open={isAddModalOpen} handleClose={closeAddModal} />

      <Box sx={{ my: 2 }}>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
          <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
          <MenuItem value="countAsc">Count (Low to High)</MenuItem>
          <MenuItem value="countDesc">Count (High to Low)</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3}>
        {sortedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Count: {product.count}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => viewProductDetails(product)}
                >
                  View
                </Button>
                <Button size="small" onClick={() => openDeleteModal(product)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Confirm Deletion</Typography>
          <Typography>Are you sure you want to delete this product?</Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteProduct}
            >
              Confirm
            </Button>
            <Button variant="outlined" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductListView;
