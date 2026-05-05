import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
	name: 'nair-cms',
	title: 'Nair Entertainment CMS',
	projectId,
	dataset,

	plugins: [
		structureTool({ structure }),
		visionTool({ defaultApiVersion: '2024-10-01' })
	],

	schema: {
		types: schemaTypes,
		// hide singletons from "create new" menu
		templates: (templates) =>
			templates.filter(
				({ schemaType }) =>
					![
						'siteSettings',
						'heroSection',
						'introSection',
						'disciplinesSection',
						'collabsSection',
						'whyUsSection'
					].includes(schemaType)
			)
	},

	document: {
		// disable delete + duplicate for singletons
		actions: (input, context) =>
			[
				'siteSettings',
				'heroSection',
				'introSection',
				'disciplinesSection',
				'collabsSection',
				'whyUsSection'
			].includes(context.schemaType)
				? input.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
				: input
	}
});
