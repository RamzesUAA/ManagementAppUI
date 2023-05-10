const generateIdSlug = (id = "") => {
  const shortId = (id ?? "").slice(0, 8).toUpperCase();

  return shortId;
};

export default generateIdSlug;
