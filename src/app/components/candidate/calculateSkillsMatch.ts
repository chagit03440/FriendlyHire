interface SkillMatch {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

function normalizeSkill(skill: string): string {
  if (skill.length < 2) skill += "!";
  return skill
    .toLowerCase()
    .replace(/[-_./\s]+/g, "") // Remove spaces, dashes, underscores, and periods
    .trim();
}

export function calculateSkillsMatch(
  userSkills: string[],
  requiredSkills: string[]
): SkillMatch {
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  
  // If the user has no skills, return a default high match percentage
  if (!userSkills) {
    return { matchPercentage: 100, matchedSkills, missingSkills };
  }
  // Check each required skill
  for (const requiredSkill of requiredSkills) {
    const normalized2 = normalizeSkill(requiredSkill);

    const hasMatch = userSkills.some((userSkill) => {
      const normalized1 = normalizeSkill(userSkill);

      return (
        normalized1 === normalized2 ||
        normalized1.includes(normalized2) ||
        normalized2.includes(normalized1)
      );
    });

    if (hasMatch) {
      matchedSkills.push(requiredSkill);
    } else {
      missingSkills.push(requiredSkill);
    }
  }

  // Calculate match percentage
  const matchPercentage =
    requiredSkills.length > 0
      ? (matchedSkills.length / requiredSkills.length) * 100
      : 0;

  return {
    matchPercentage: Math.round(matchPercentage),
    matchedSkills,
    missingSkills,
  };
}
