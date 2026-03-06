import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

export default function SnackBarAlert({ open, setOpen, msg }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <SnackbarContent
        sx={{
          borderRadius: "12px",
          boxShadow: 3,
        //  backgroundColor: status ? "#612cffff" : "rgb(59, 130, 246)",
          color: "white",
        }}
        message={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
             // src="/logo/originallogo.png"
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ fontWeight: 700 }}>{msg}</Box>
          </Box>
        }
      />
    </Snackbar>
  );
}