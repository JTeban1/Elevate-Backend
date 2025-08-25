
export async function initDefaults() {
    const count = await Role.count();
    if (count === 0) {
      await Role.bulkCreate([{ name: "admin" }, { name: "recruiter" }]);
    }
  
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    const recruiterRole = await Role.findOne({ where: { name: "recruiter" } });
  
    // Create Admin user if it does not exist
    const adminExists = await User.findOne({ where: { email: "admin@cv-talent.com" } });
    if (!adminExists) {
      await createUser({
        name: "Administrator",
        email: "admin@cv-talent.com",
        password: "Admin123!", // is encrypted with Argon2id in createUser
        role_id: adminRole.role_id,
      });
    }
  
    // Create Recruiter user if it does not exist
    const recruiterExists = await User.findOne({ where: { email: "recruiter@cv-talent.com" } });
    if (!recruiterExists) {
      await createUser({
        name: "Recruiter",
        email: "recruiter@cv-talent.com",
        password: "Recruiter123!",
        role_id: recruiterRole.role_id,
      });
    }
  }
  