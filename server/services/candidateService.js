export const filterCandidates = (candidates, parsed) => {
  if (!parsed) {
    throw new Error("Parse data is missing - cannot filter candidates");
  }

  if (!parsed.role) {
    throw new Error("Missing 'role' in parsed data");
  }

  console.log("  🔍 Starting candidate filtering...");
  console.log("  🔹 Total candidates in database:", candidates.length);

  const filtered = candidates.filter((candidate) => {
    const roleMatch = candidate.role
      .toLowerCase()
      .includes(parsed.role.toLowerCase());

    const candidateExperience = Number(
      String(candidate.experience).replace(/[^\d]/g, ""),
    );
    const requiredExperience = parsed.experience
      ? Number(String(parsed.experience).replace(/[^\d]/g, ""))
      : 0;
    const expMatch = parsed.experience
      ? candidateExperience >= requiredExperience
      : true;

    const requiredSkills = Array.isArray(parsed.skills) ? parsed.skills : [];
    const skillMatch = requiredSkills.length
      ? requiredSkills.every((skill) =>
          candidate.skills
            .map((candidateSkill) => candidateSkill.toLowerCase())
            .includes(skill.toLowerCase()),
        )
      : true;

    if (roleMatch && expMatch && skillMatch) {
      console.log(
        `  ✅ ${candidate.name} - Role: ${roleMatch}, Exp: ${expMatch}, Skills: ${skillMatch}`,
      );
    } else {
      console.log(
        `  ❌ ${candidate.name} - Role: ${roleMatch}, Exp: ${expMatch}, Skills: ${skillMatch}`,
      );
    }

    return roleMatch && expMatch && skillMatch;
  });

  console.log(
    "  📊 Filtering complete! Matched:",
    filtered.length,
    "candidates",
  );

  return filtered;
};
