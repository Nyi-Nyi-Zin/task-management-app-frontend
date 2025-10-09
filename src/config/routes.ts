export const ROUTES = {
  HOME: "/",
  PROGRAMS: "/programs",
  PROGRAM_DETAIL: (programId: number, academic: string) =>
    `/programs/${programId}/${getSlug(academic)}`,

  COURSE_DETAIL: (programId: number, academic: string, courseTitle: string) =>
    `/programs/${programId}/${getSlug(academic)}/${getSlug(courseTitle)}`,
  ABOUT: "/about",
  SERVICES: "/services",
  ACTIVITIES: "/activities",
  ACTIVITIESDETAIL: (ACTIVITIESId: string | number) =>
    `/activities/${ACTIVITIESId}`,
  ANNOUNCEMENTS: "/announcements",
  ANNOUNCEMENT_DETAIL: (id: number) => `/announcements/${id}`,
  ARTICLES: "/articles",
  FAQ: "/faq",
  CONTACT: "/contact",
  TEAMMEMBERS: "/team-members",
  PROFILE: "/profile",
} as const;
