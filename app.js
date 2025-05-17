const express = require("express");
const app = express();
app.use(express.json());

const authRout = require("./routes/auth");
const userRout = require("./routes/users");
const sponsorRout = require("./routes/sponsorshipManagement");
const donationRout = require("./routes/Donation");
const volunteersRout = require("./routes/volunteers");
const applicationssRout = require("./routes/Applications");
const opportunityRoutes = require("./routes/opportunities");
const orphanRoutes = require("./routes/orphans");
const orphanageRoutes = require("./routes/orphanages");
const reviewsRoutes = require("./routes/reviews");
const deliveriesRoutes = require("./routes/deliveries");

app.use("/users", userRout);
app.use("/auth", authRout);
app.use("/sponsorship", sponsorRout);
app.use("/donations", donationRout);
app.use("/volunteers", volunteersRout);
app.use("/applications", applicationssRout);
app.use("/opportunities", opportunityRoutes);
app.use("/orphans", orphanRoutes);
app.use("/orphanages", orphanageRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/deliveries", deliveriesRoutes);

app.listen(8000, () => {
  console.log("iam litening at port 8000");
});
