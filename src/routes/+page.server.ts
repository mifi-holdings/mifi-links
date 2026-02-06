import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ parent }) => parent();
