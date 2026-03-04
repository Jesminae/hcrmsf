const natural = require("natural");
const classifier = new natural.BayesClassifier();

/* TRAINING DATA */
classifier.addDocument("water not coming in bathroom", "Plumbing");
classifier.addDocument("low water pressure", "Plumbing");
classifier.addDocument("toilet flush not working", "Plumbing");
classifier.addDocument("basin blocked", "Plumbing");
classifier.addDocument("drain clogged", "Plumbing");
classifier.addDocument("pipe leaking in kitchen", "Plumbing");
classifier.addDocument("shower not working", "Plumbing");
classifier.addDocument("tap broken", "Plumbing");
classifier.addDocument("water overflow in sink", "Plumbing");
classifier.addDocument("bathroom flooding", "Plumbing");


classifier.addDocument("no power in room", "Electricity");
classifier.addDocument("light not glowing", "Electricity");
classifier.addDocument("fan slow", "Electricity");
classifier.addDocument("charging point not working", "Electricity");
classifier.addDocument("plug point damaged", "Electricity");
classifier.addDocument("frequent power cut", "Electricity");
classifier.addDocument("electric shock from switch", "Electricity");
classifier.addDocument("tube light not working", "Electricity");
classifier.addDocument("power socket loose", "Electricity");
classifier.addDocument("room dark no lights", "Electricity");

classifier.addDocument("room not cleaned", "Cleanliness");
classifier.addDocument("washroom dirty", "Cleanliness");
classifier.addDocument("toilet smells bad", "Cleanliness");
classifier.addDocument("corridor dirty", "Cleanliness");
classifier.addDocument("dust everywhere", "Cleanliness");
classifier.addDocument("spider webs", "Cleanliness");
classifier.addDocument("mosquito problem", "Cleanliness");
classifier.addDocument("rats in room", "Cleanliness");
classifier.addDocument("floor not mopped", "Cleanliness");
classifier.addDocument("bathroom dirty smell", "Cleanliness");
classifier.addDocument("cockroach in bathroom","Cleanliness");

classifier.addDocument("wifi not connecting", "Internet");
classifier.addDocument("internet very slow", "Internet");
classifier.addDocument("no signal in room", "Internet");
classifier.addDocument("network not available", "Internet");
classifier.addDocument("wifi disconnecting", "Internet");
classifier.addDocument("cannot open websites", "Internet");
classifier.addDocument("router not working", "Internet");
classifier.addDocument("wifi password not working", "Internet");
classifier.addDocument("no internet access", "Internet");
classifier.addDocument("signal very weak", "Internet");


classifier.addDocument("door handle broken", "Maintenance");
classifier.addDocument("lock not working", "Maintenance");
classifier.addDocument("window glass broken", "Maintenance");
classifier.addDocument("cupboard damaged", "Maintenance");
classifier.addDocument("chair broken", "Maintenance");
classifier.addDocument("table shaky", "Maintenance");
classifier.addDocument("bed making noise", "Maintenance");
classifier.addDocument("fan stand loose", "Maintenance");
classifier.addDocument("curtain rod broken", "Maintenance");
classifier.addDocument("mirror broken", "Maintenance");

/* Food / Mess */
classifier.addDocument("food not good bad taste", "Food");
classifier.addDocument("mess food bad quality", "Food");
classifier.addDocument("food cold stale", "Food");
classifier.addDocument("rice not cooked properly", "Food");
classifier.addDocument("mess issue food problem", "Food");
classifier.addDocument("insects in food", "Food");

/* Filter / Water Filter */
classifier.addDocument("filter not working", "Filter");
classifier.addDocument("filter problem", "Filter");
classifier.addDocument("cockroach in filter", "Filter");
classifier.addDocument("filter dirty not cleaned", "Filter");
classifier.addDocument("no water from filter", "Filter");
classifier.addDocument("bad smell from filter water", "Filter");


/* TRAIN MODEL */
classifier.train();

/* EXPORT PREDICTION FUNCTION */
function predictCategory(text) {
  return classifier.classify(text);
}

module.exports = predictCategory;
