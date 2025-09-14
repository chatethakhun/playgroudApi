export default function withUser(schema) {
  schema.add({
    user: {
      type: schema.constructor.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  });

  schema.query.forUser = function (userId) {
    this._user = userId;
    return this.where({ user: userId });
  };

  const autoScope = function (next) {
    if (this._user) this.where({ user: this._user });
    next();
  };

  schema.pre("find", autoScope);
  schema.pre("findOne", autoScope);
  schema.pre("findOneAndUpdate", autoScope);
  schema.pre("findOneAndDelete", autoScope);
  schema.pre("updateMany", autoScope);
  schema.pre("updateOne", autoScope);
  schema.pre("deleteMany", autoScope);
  schema.pre("deleteOne", autoScope);
}
