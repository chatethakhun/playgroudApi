import Workout from "../models/Workout.js";

export const getListWorkout = async (req, res) => {
  try {
    const workouts = await Workout.find();

    res.status(200).json({
      workouts,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const createWorkout = async (req, res) => {
  try {
    const workout = await new Workout({
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description,
      workoutType: req.body.workoutType,
      workoutReps: req.body.workoutReps,
      workoutSets: req.body.workoutSets,
    }).save();

    res.status(201).json({
      workout,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getSingleWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      res.status(404).send("Workout not found");
      return;
    }

    res.status(200).json({
      workout,
    });
  } catch (error) {
    console.log("error from getSingleWorkout", error);
    res.status(500).send(error);
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!workout) {
      res.status(404).send("Workout not found");
      return;
    }

    res.status(200).json({
      workout,
    });
  } catch (error) {
    console.log("error from updateWorkout", error);
    res.status(500).send(error);
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.deleteOne({ _id: req.params.id });

    res.status(200).send("Workout deleted");
  } catch (error) {
    console.log("error from deleteWorkout", error);
    res.status(500).send(error);
  }
};
