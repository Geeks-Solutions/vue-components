export const mediaHeader = (header, projectId) => {
  if(!process.server) {
    const headerKey = `project-id-${projectId}`;
    header[headerKey] = projectId;
    if(header.origin){
      header['access-control-request-headers'] = headerKey;
    }
    return header
  } else return header
}
// showSectionsToast function removed, use the useAppToast composable instead.

export const acceptedFileTypes = '.pdf, .doc, .docx, .zip, .json, .css, .scss, .xlsx, .xlsb, .xltx'

export const parseDate = (timestamp) => {
  const timestampInMs = timestamp * 1000;
  const date = new Date(timestampInMs);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
