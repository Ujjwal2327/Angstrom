-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sectionOrder" TEXT[] DEFAULT ARRAY['achievements', 'experience', 'projects', 'skills', 'education']::TEXT[];
