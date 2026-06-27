const bcrypt = require("bcryptjs");

const database = require("../config/database");
const SALT_ROUNDS = 6;

module.exports = {
  create,
  findOne,
};


async function create(userData) {
  const email = userData.email.toLowerCase().trim();
  const f_name = userData.f_name.trim();
  const l_name = userData.l_name.trim();
  const password = userData.password.trim();
  const status_id = userData.status_id;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await database.query(
    `
      INSERT INTO public.users (email, f_name, l_name, password, status_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id, email, f_name, l_name, status_id
    `,
    [email, f_name, l_name, hashedPassword, status_id]
  );

  return result.rows[0] || null;
}

async function findOne(req) {
  console.log("in find One", req)
  
  const email = req.email.trim().toLowerCase();
  
  console.log("in find One", email)
  
  const result = await database.query(
    `
      SELECT user_id, email, f_name, l_name, password, status_id
      FROM public.users
      WHERE lower(trim(email)) = $1
      LIMIT 1
    `, [email]);

  console.log(result)
  return result.rows[0] || null;
}
