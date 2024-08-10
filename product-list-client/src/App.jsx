import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from "./components/Layout";
import ProductListView from "./components/ProductListView";
import ProductView from "./components/ProductView";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProductListView />} />
            <Route path="/product" element={<ProductView />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;