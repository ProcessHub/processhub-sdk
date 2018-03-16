import { ProcessDetails } from "./processinterfaces";

// filter tags that are used in the given processes
export function filterExistingTags(processes: ProcessDetails[], tags: string[]): string[] {
  let filteredTags: string[] = [];
  processes.map(process => {
    if (process.tags) {
      process.tags.map(processTag => {
        let foundTag = tags.find(tag => tag == processTag);
        if (foundTag != null) {
          if (filteredTags.find(tag => tag == processTag) == null) {
            filteredTags.push(foundTag);
          }
        }
      });
    }
  });

  return filteredTags;
}