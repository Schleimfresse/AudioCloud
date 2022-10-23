/**
 * Converts the integer specified in the `num` parameter into a two-digit number in a `String.`
 * @param {*} num any integer to convert
 * @returns	a `string` with the converted `num` value
 * @since 1.2.0
 */
declare function padTo2Digits(num: number): string;
/**
 * Formats the integer specified in `duration` parameter into minutes and seconds which are returned in a `String`.
 * @param {*} duration any integer to convert
 * @returns	a converted `string` with the duration from `duration` parameter
 * @since 1.2.0
 */
declare function formatDuration(duration: number): string;
/**
 * Creates a thumbnail for the file specified in the `filename` parameter using the specified parameters and FFmpeg.
 * @param {*} metadata metadata from the file
 * @param {*} name the name of the medium (general designation)
 * @param {*} filename the name of the file (with extension)
 * @param {*} res the express `response` parameter
 * @returns {*} nothing on success, on error a response to the client will be sent
 * @since 1.2.0
 */
declare function createThumbnail(metadata: {
    duration: number;
}, name: string, filename: string): boolean;
/**
 * Updates the recent activity by providing the related objects in the database with indexes that reflect the activity.
 * @param {*} type `string` with the id of the medium
 * @param {*} res the express `response` parameter
 * @returns {*} nothing on success, on error a response to the client will be sent
 * @since 1.3.0
 */
declare function updateRecentActivity(type: string, res: {
    status: (arg0: number) => void;
    render: (arg0: string, arg1: {
        heading: string;
        desc: string;
    }) => void;
}): void;
/**
 * Modifies the `String` in the specified `string` parameter in which URLs are recognised and provided with HTML link tags to be interpreted as such on the client.
 * @param {*} string any type of `String`
 * @returns a modified `string` where URLS are marked as such by HTML tags.
 * @since 1.5.0
 */
declare function replaceURLs(string: string): string;
/**
 * Searches the file specified in the `filname` parameter for the metadata using FFmpeg.
 * @async
 * @param {*} filename the name of the file (with extention)
 * @returns a `Object` with the metadata of the file which was passed through the `filename` parameter
 * @since 1.5.0
 */
declare function getMetadata(filename: string): Promise<any>;
declare const _default: {
    padTo2Digits: typeof padTo2Digits;
    formatDuration: typeof formatDuration;
    createThumbnail: typeof createThumbnail;
    updateRecentActivity: typeof updateRecentActivity;
    ffmpeg: any;
    replaceURLs: typeof replaceURLs;
    getMetadata: typeof getMetadata;
    database: any;
    history_Database: any;
    ffmpegInstaller: any;
    ffmpegprobe: any;
    STANDARD_THUMBNAIL: string;
    STANDARD_THUMBNAIL_EXT: string;
};
export default _default;
