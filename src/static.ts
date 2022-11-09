import { DataviewApi, getAPI } from "obsidian-dataview";
import {
  getFieldFromTFile,
  doesFieldExistInTFile,
  insertFieldInTFile,
  updateFieldInTFile,
  updateOrInsertFieldInTFile,
  deleteFieldInTFile
} from "@opd-libs/opd-metadata-lib/lib/API";
import {
  MetadataEditApi,
  MetaScryPluginApi
} from "./api";

/**
 * Static container for the current meta-scry plugin instance.
 * For Internal use. The name is dumb so you don't want to use it anyway.
 * 
 * Internal Static Metadata Scrier Plugin Container
 */

export class InternalStaticMetadataScrierPluginContainer {

  /**
   * The current instance of the Metadata Scry Api Plugin.
   */
  static Instance: MetaScryPluginApi;

  /**
   * Access to the Metaedit Api
   * (Write access)
   */
  static get MetadataEditApi(): MetadataEditApi {
    const plugin = (app as any)
      .plugins
      .plugins["opd-settings-lib-test-plugin"];

    return {
      plugin,
      Plugin: plugin,
      getFieldFromTFile: (x, y, z) => getFieldFromTFile(x, y, plugin, z),
      doesFieldExistInTFile: (x, y, z) => doesFieldExistInTFile(x, y, plugin, z),
      insertFieldInTFile: (x, y, z, a) => insertFieldInTFile(x, y, z, plugin, a),
      updateFieldInTFile: (x, y, z, a) => updateFieldInTFile(x, y, z, plugin, a),
      updateOrInsertFieldInTFile: (x, y, z, a) => updateOrInsertFieldInTFile(x, y, z, plugin, a),
      deleteFieldInTFile: (x, y, z) => deleteFieldInTFile(x, y, plugin, z)
    };
  }

  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
  static get DataviewApi(): DataviewApi {
    return getAPI() as DataviewApi;
  }
}
