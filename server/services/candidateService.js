export const filterCandidates = (candidates, parsed) => {
  if (!parsed) {
    throw new Error("Parse data is missing - cannot filter candidates");
  }

  if (!parsed.role) {
    throw new Error("Missing 'role' in parsed data");
  }

  // if (!parsed.experience) {
  //   throw new Error("Missing 'experience' in parsed data");
  // }

  // if (!parsed.skills || !Array.isArray(parsed.skills)) {
  //   throw new Error("Missing or invalid 'skills' array in parsed data");
  // }

  console.log("  🔍 Starting candidate filtering...");
  console.log("  🔹 Total candidates in database:", candidates.length);

  const filtered = candidates.filter((candidate) => {
    const roleMatch = candidate.role
      .toLowerCase()
      .includes(parsed.role.toLowerCase());

    const expMatch = candidate.experience >= Number(parsed.experience);

    const skillMatch = parsed.skills.every((skill) =>
      candidate.skills.includes(skill),
    );

    // Log each candidate's matching status
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
