const validateInputParams = (searchParams) => {
  const name = searchParams.name;
  const age = searchParams.age;
  const hobbies = searchParams.hobbies;

  return !(!name || !age || !Array.isArray(hobbies));
}

module.exports = { validateInputParams };
