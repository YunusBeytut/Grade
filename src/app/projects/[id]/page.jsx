import { projects } from '@/data/Projects'
import ProjectDetails from '@/components/ProjectDetails'

// /projects/[id]/page.jsx
export default async function ProjectPage({ params }) {
    // Async ekleyin
    const project = projects.find(p => p.id.toString() === params.id);

    if (!project) {
        return notFound();
    }

    return <ProjectDetails project={project} />;
}