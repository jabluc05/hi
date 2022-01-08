import execa from "execa";
import {
    existsSync,
    readFileSync,
    writeFileSync
} from "fs";
import { join, resolve } from "path";
import { log } from "..";
import {
    ARCHITECTURE,
    BUILD_TARGETS,
    CONFIGS_DIR,
    ENGINE_DIR,
    SRC_DIR
} from "../constants";
import { dispatch } from "../utils";

const platform: any = {
    win32: "windows",
    darwin: "macos",
    linux: "linux"
};

const applyConfig = async (os: string, arch: string) => {
    log.info("Applying mozconfig...");

    let commonConfig = readFileSync(
        resolve(CONFIGS_DIR, "common", "mozconfig"),
        "utf-8"
    );

    const changesetPrefix = commonConfig
        .split("\n")
        .find((ln) =>
            ln.startsWith("export MOZ_SOURCE_CHANGESET=")
        );

    const changeset = changesetPrefix?.replace(
        /export MOZ_SOURCE_CHANGESET=/,
        ""
    );

    const { stdout: gitSha } = await execa("git", [
        "rev-parse",
        "HEAD"
    ]);

    console.log(changeset, gitSha);

    if (changeset)
        commonConfig = commonConfig.replace(
            changeset,
            gitSha
        );

    writeFileSync(
        resolve(CONFIGS_DIR, "common", "mozconfig"),
        commonConfig
    );

    const osConfig = readFileSync(
        resolve(
            CONFIGS_DIR,
            os,
            arch === "i686"
                ? "mozconfig-i686"
                : "mozconfig"
        ),
        "utf-8"
    );

    // Allow a custom config to be placed in /mozconfig. This will not be committed
    // to origin
    const customConfig = existsSync(
        join(process.cwd(), "mozconfig")
    )
        ? readFileSync(
              join(process.cwd(), "mozconfig")
          ).toString()
        : "";

    const mergedConfig = `# This file is automatically generated. You should only modify this if you know what you are doing!\n\n${commonConfig}\n\n${osConfig}\n\n${customConfig}`;

    writeFileSync(
        resolve(ENGINE_DIR, "mozconfig"),
        mergedConfig
    );

    log.info(`Config for this \`${os}\` build:`);

    mergedConfig.split("\n").map((ln) => {
        if (
            ln.startsWith("mk") ||
            ln.startsWith("ac") ||
            ln.startsWith("export")
        )
            log.info(
                `\t${ln
                    .replace(/mk_add_options /, "")
                    .replace(/ac_add_options /, "")
                    .replace(/export /, "")}`
            );
    });
};

const genericBuild = async (os: string, tier: string) => {
    log.info(`Building for ${os}...`);

    // log.warning(
    //     `If you get any dependency errors, try running |${bin_name} bootstrap|.`
    // );

    await dispatch(
        `python3`,
        [resolve(SRC_DIR, "dot", "icons", "compile-icons.py")],
        process.cwd()
    )

    log.info(`Rebuilt icons, starting build...`);

    await dispatch(
        `./mach`,
        ["build"].concat(tier ? [tier] : []),
        ENGINE_DIR,
        false,
        true
    );
};

const parseDate = (d: number) => {
    d = d / 1000;
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay =
        h > 0
            ? h + (h == 1 ? " hour, " : " hours, ")
            : "";
    var mDisplay =
        m > 0
            ? m + (m == 1 ? " minute, " : " minutes, ")
            : "";
    var sDisplay =
        s > 0
            ? s + (s == 1 ? " second" : " seconds")
            : "";
    return hDisplay + mDisplay + sDisplay;
};

const success = (date: number) => {
    // mach handles the success messages
    console.log();
    log.info(
        `Total build time: ${parseDate(
            Date.now() - date
        )}.`
    );
};

interface Options {
    arch: string;
}

export const build = async (
    tier: string,
    options: Options
) => {
    let d = Date.now();

    // Host build

    const prettyHost = platform[process.platform as any];

    if (BUILD_TARGETS.includes(prettyHost)) {
        let arch = "64bit";

        if (options.arch) {
            if (!ARCHITECTURE.includes(options.arch))
                return log.error(
                    `We do not support "${
                        options.arch
                    }" build right now.\nWe only currently support ${JSON.stringify(
                        ARCHITECTURE
                    )}.`
                );
            else arch = options.arch;
        }

        applyConfig(prettyHost, options.arch);

        await genericBuild(prettyHost, tier).then(
            (_) => success(d)
        );
    }
};
