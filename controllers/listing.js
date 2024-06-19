const Listing = require("../models/listing");
const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find(Object.keys(req.query).length === 0 ? {} : { $text: { $search: req.query.search } });
  if (!allListings) {
    req.flash("fail", "no search found");
  }
  res.render("listings/index.ejs", { allListings });
};

module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    res.flash("fail", "Listing you are requested for doesn't exit.!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.create = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let saveListing = await newListing.save();
  console.log(saveListing);
  req.flash("success", "new listing created Successfully");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    res.flash("fail", "listing you requested doesn't exist");
  }
  req.flash("success", "listing Edited.!");
  res.render("listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("fail", "Deleted the listing");
  console.log(deletedListing);
  res.redirect("/listings");
};
