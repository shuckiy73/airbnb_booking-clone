import React from "react";
import { Button, Grid, TextField } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

const SendReview = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика обработки отправки формы
  };

  return (
    <div className="container">
      <form method="POST" className="needs-validation" autoComplete="off" onSubmit={handleSubmit}>
        <div className="mb-3 align-content-center">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                id="cleanliness"
                label="Чистота"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 10 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                id="timeliness_of_check_in"
                label="Своевременность заселения"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 10 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                id="location"
                label="Расположение"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 10 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                id="conformity_to_photos"
                label="Соответствие фото"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 10 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                id="price_quality"
                label="Цена - качество"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 10 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                id="quality_of_service"
                label="Качество обслуживания"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 10 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <div className="row mt-3">
            <div className="input-group">
              <TextareaAutosize
                id="comment"
                className="form-control"
                minRows={5}
                placeholder="Ваш комментарий..."
                aria-label="Ваш комментарий"
              />
              <Button type="submit" variant="outlined" color="success" style={{ marginLeft: "10px" }}>
                Опубликовать
              </Button>
            </div>
          </div>
        </div>
      </form>
      <br />
    </div>
  );
};

export default SendReview;