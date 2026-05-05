import { localizedString, localizedText, localizedRichText } from './objects/localizedString';
import { siteSettings } from './singletons/siteSettings';
import { heroSection } from './singletons/heroSection';
import { introSection } from './singletons/introSection';
import { disciplinesSection } from './singletons/disciplinesSection';
import { collabsSection } from './singletons/collabsSection';
import { whyUsSection } from './singletons/whyUsSection';
import { season } from './documents/season';
import { event } from './documents/event';
import { service } from './documents/service';
import { artist } from './documents/artist';
import { faqItem } from './documents/faqItem';

export const schemaTypes = [
	// objects
	localizedString,
	localizedText,
	localizedRichText,
	// singletons
	siteSettings,
	heroSection,
	introSection,
	disciplinesSection,
	collabsSection,
	whyUsSection,
	// documents
	season,
	event,
	service,
	artist,
	faqItem
];
