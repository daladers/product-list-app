import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/ProductSlice";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  Title,
  Image,
  Numbers,
  Height,
  Scale,
} from "@mui/icons-material";

const AddProductModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      name.trim() !== "" &&
      count !== "" &&
      imageUrl.trim() !== "" &&
      width !== "" &&
      height !== "" &&
      weight.trim() !== ""
    );
  }, [name, count, imageUrl, width, height, weight]);

  const handleAddProduct = () => {
    if (isFormValid) {
      dispatch(
        addProduct({
          name,
          count: parseInt(count),
          imageUrl,
          size: { width: parseInt(width), height: parseInt(height) },
          weight,
          comments: [],
        })
      );
      handleClose();
      // Reset form fields
      setName("");
      setCount("");
      setImageUrl("");
      setWidth("");
      setHeight("");
      setWeight("");
    }
  };

  const handleCountChange = (e) => {
    const value = e.target.value;
    setCount(value === "" ? "" : Math.max(0, parseInt(value)));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Product
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Title />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Count"
              type="number"
              value={count}
              onChange={handleCountChange}
              inputProps={{ min: 0 }}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Numbers />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Width"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              inputProps={{ min: 0 }}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Height sx={{ transform: 'rotate(90deg)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              inputProps={{ min: 0 }}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Height />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Scale />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            disabled={!isFormValid}
          >
            Add
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

AddProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddProductModal;