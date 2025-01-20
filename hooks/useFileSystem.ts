// Import necessary modules from expo-file-system and async-storage
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the MediaSystem class
export class MediaSystem {
  // Define a private property to store download information
  private downloads: Record<
    string,
    { downloadResumable: FileSystem.DownloadResumable; progress: number }
  >;

  // Constructor initializes the downloads object
  constructor() {
    this.downloads = {};
  }

  // Private method to save the download state to AsyncStorage
  private async saveDownloadState(downloadId: string, state: any) {
    await AsyncStorage.setItem(downloadId, JSON.stringify(state));
  }

  // Private method to retrieve the saved download state from AsyncStorage
  private async getSavedDownloadState(downloadId: string) {
    const savedState = await AsyncStorage.getItem(downloadId);
    return savedState ? JSON.parse(savedState) : null;
  }

  // Public method to handle download progress updates
  public async callback(
    downloadId: string,
    downloadProgress: {
      totalBytesWritten: number;
      totalBytesExpectedToWrite: number;
    }
  ) {
    // Calculate the progress as a fraction
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;

    // Update the in-memory state
    if (this.downloads[downloadId]) {
      this.downloads[downloadId].progress = progress;
    }

    // Save the progress to persistent storage
    await this.saveDownloadState(downloadId, {
      progress,
      totalBytesWritten: downloadProgress.totalBytesWritten,
    });

    // Log the progress to the console
   // console.log(`Download [${downloadId}] Progress: ${progress * 100}%`);
  }

  // Public method to start a new download
  public async startDownload(uri: string, filename: string) {
    const downloadId = `${uri}-${filename}`;
    const savedState = await this.getSavedDownloadState(downloadId);

    let downloadResumable: FileSystem.DownloadResumable;

    // If there's a saved state, resume the download from where it left off
    if (savedState) {
      const { totalBytesWritten } = savedState;
      downloadResumable = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory + filename,
        {},
        (progress) => this.callback(downloadId, progress),
        totalBytesWritten
      );
    } else {
      // Otherwise, start a new download
      downloadResumable = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory + filename,
        {},
        (progress) => this.callback(downloadId, progress)
      );
    }

    // Store the download information in the downloads object
    this.downloads[downloadId] = {
      downloadResumable,
      progress: savedState?.progress || 0,
    };

    let result;
    try {
      // Start or resume the download
      result = await downloadResumable.downloadAsync();
      if (result) {
        // Log the completion and clean up the saved state
        console.log(`Download [${downloadId}] completed: ${result.uri}`);
        await AsyncStorage.removeItem(downloadId);
      } else {
        console.error(`Download [${downloadId}] failed: No result returned`);
      }
    } catch (e) {
      console.error(`Download [${downloadId}] failed:`, e);
    }

    return {downloadId, result};
  }

  // Public method to pause a download
  public async pauseDownload(downloadId: string) {
    const download = this.downloads[downloadId];
    if (!download) {
      console.error(`Download [${downloadId}] not found.`);
      return;
    }

    try {
      // Pause the download and save the pause info
      const pauseInfo = await download.downloadResumable.pauseAsync();
      console.log(`Download [${downloadId}] paused:`, pauseInfo);
      await this.saveDownloadState(downloadId, pauseInfo);
    } catch (e) {
      console.error(`Failed to pause download [${downloadId}]:`, e);
    }
  }

  // Public method to resume a paused download
  public async resumeDownload(downloadId: string) {
    const savedState = await this.getSavedDownloadState(downloadId);
    if (!savedState) {
      console.error(`No saved state found for download [${downloadId}].`);
      return;
    }

    const { totalBytesWritten } = savedState;
    const { uri, filename } = this.parseDownloadId(downloadId);

    // Create a resumable download object
    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      FileSystem.documentDirectory + filename,
      {},
      (progress) => this.callback(downloadId, progress),
      totalBytesWritten
    );

    // Update the downloads object with the resumable download
    this.downloads[downloadId] = {
      downloadResumable,
      progress: savedState.progress,
    };

    try {
      // Resume the download
      const result = await downloadResumable.resumeAsync();
      if (result) {
        console.log(`Download [${downloadId}] resumed: ${result.uri}`);
        await AsyncStorage.removeItem(downloadId);
        return result;
      } else {
        console.error(
          `Failed to resume download [${downloadId}]: No result returned`
        );
      }
    } catch (e) {
      console.error(`Failed to resume download [${downloadId}]:`, e);
    }
  }

  // Public method to get the progress of a download
  public getProgress(downloadId: string) {
    return this.downloads[downloadId]?.progress || 0;
  }

  // Private method to parse the download ID into URI and filename
  private parseDownloadId(downloadId: string) {
    const splitIndex = downloadId.lastIndexOf("-");
    const uri = downloadId.substring(0, splitIndex);
    const filename = downloadId.substring(splitIndex + 1);
    return { uri, filename };
  }
}
