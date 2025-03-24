import React, { useState, useEffect } from "react";
import { customerService } from "../services/api";
import CustomerForm from "./customerForm";
import {
  Box,
  Button,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
} from "@mui/material";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    region: "",
    date: "",
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
      setError("");
    } catch (err) {
      setError("Müşterler yüklenirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const hasFilters = Object.values(filters).some(
      (value) => value.trim() !== ""
    );
    if (!hasFilters) {
      loadCustomers();
      return;
    }

    try {
      setLoading(true);
      const data = await customerService.search(filters);
      setCustomers(data);
      setError("");
    } catch (err) {
      setError("Filtreleme işlemi başarısız oldu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      email: "",
      region: "",
      date: "",
    });
    loadCustomers();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu müşteriyi silmek istediğinizden emin misiniz?")) {
      try {
        await customerService.delete(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
      } catch (err) {
        setError("Silme işlemi başarısız oldu.");
        console.error(err);
      }
    }
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setCurrentCustomer(null);
    setShowForm(true);
  };

  const handleSave = async (customer) => {
    try {
      if (customer.id) {
        await customerService.update(customer.id, customer);
      } else {
        await customerService.create(customer);
      }
      setShowForm(false);
      loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Kayıt işlemi başarısız oldu.");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Müşteri Yönetimi</Typography>
        <Button variant="contained" color="primary" onClick={handleAddNew}>
          Yeni Müşteri Ekle
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtreleme
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <TextField
            label="İsim"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Mail"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Bölge"
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Kayıt Tarihi"
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Arama
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleResetFilters}
          >
            Sıfırla
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Typography align="center">Yükleniyor...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>İsim</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Bölge</TableCell>
                <TableCell>Kayıt Tarihi</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Müşteri bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.region}</TableCell>
                    <TableCell>
                      {customer.registrationDate
                        ? new Date(
                            customer.registrationDate
                          ).toLocaleDateString("tr-TR")
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(customer)}
                        sx={{ mr: 1 }}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showForm && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
            }}
          >
            <CustomerForm
              customer={currentCustomer}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CustomerList;
