
import User from "../entities/UsersEntity.js";
import Role from "../entities/RolEntity.js";

export const getUsers = async () => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["role_id", "name"],
        },
      ],
      attributes: ["user_id", "name", "email"],
    });
    return users;
  } catch (error) {
    console.error("Error en getUsers:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          attributes: ["role_id", "name"],
        },
      ],
      attributes: ["user_id", "name", "email"],
    });
    return user;
  } catch (error) {
    console.error("Error en getUserById:", error);
    throw error;
  }
};

export const loginUser = async (email, plainPassword) => {
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        attributes: ["role_id", "name"],
      },
    ],
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Validar contraseña
  const isValid = await bcrypt.compare(plainPassword, user.password);
  if (!isValid) {
    throw new Error("Contraseña incorrecta");
  }

  // Retornar sin el password
  const { password, ...userWithoutPass } = user.toJSON();
  return userWithoutPass;
};