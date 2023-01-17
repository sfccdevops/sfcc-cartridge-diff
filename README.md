Project Support
===

If you or your company enjoy using this project, please consider supporting my work and joining my discord. 💖

[![Become a GitHub Sponsor](https://img.shields.io/badge/Sponsor-171515.svg?logo=github&logoColor=white&style=for-the-badge "Become a GitHub Sponsor")](https://github.com/sponsors/sfccdevops)
[![Become a Patreon Sponsor](https://img.shields.io/badge/Sponsor-FF424D.svg?logo=patreon&logoColor=white&style=for-the-badge "Become a Patreon Sponsor")](https://patreon.com/peter_schmalfeldt)
[![Donate via PayPal](https://img.shields.io/badge/Donate-169BD7.svg?logo=paypal&logoColor=white&style=for-the-badge "Donate via PayPal")](https://www.paypal.me/manifestinteractive)
[![Join Discord Community](https://img.shields.io/badge/Community-5865F2.svg?logo=discord&logoColor=white&style=for-the-badge "Join Discord Community")](https://discord.gg/A4ns7B4aDc)

------

![Logo](https://sfccdevops.s3.amazonaws.com/logo-128.png "Logo")

SFCC Cartridge Diff Tool
---

> Command Line Tool for Salesforce Commerce Cloud Cartridge Compare.  SFCC Cartridge Diff Tool.  Working with SFCC Cartridge overrides just got easier:  Compare client cartridge against other cartridges, Generate diffs between override files & Filter using local git changes.

Introduction
---

Working with SFCC Cartridge overrides just got easier:

- [X] Compare client cartridge against other cartridges
- [X] Generate diffs between override files
- [X] Filter using local git changes

Install
---

#### Requirements

- [X] [Node v14+](https://nodejs.org/en/download/)

#### Install via NPM

```bash
npm install -g @sfccdevops/sfcc-cartridge-diff
```

#### Install via Clone

```bash
git clone https://github.com/sfccdevops/sfcc-cartridge-diff.git
cd sfcc-cartridge-diff
npm install -g
```

Usage
---

> You can use this tool in any of your SFCC projects. Change to the directory that contains your `dw.json` file to run the terminal command.

```bash
cd /path/to/sfcc/project
sfcc-diff --cartridge app_client_name --options
```

**OPTIONS:**

Name          | Param             | Alias | Definition
--------------|-------------------|-------|----------------------------------------------
Cartridge     | `--cartridge`     | `-c`  | Source Cartridge
Diff          | `--diff`          | `-d`  | Show Full Diff
Exclude       | `--exclude`       | `-e`  | List of Cartridges to Exclude
Filter        | `--filter`        | `-f`  | Filter Results for Match
Include       | `--include`       | `-i`  | List of Cartridges to Include
Junk Only     | `--junk-only`     | `-j`  | Junk Files Only
Modified Only | `--modified-only` | `-m`  | Modified Files Only

Examples
---

#### Comparing Client Cartridge to All Cartridges:

> This is the Default Behavior and will compare the provided cartridge to ALL cartridges in the current directory ( event nested ones ).

```bash
sfcc-diff --cartridge app_client_name
sfcc-diff -c app_client_name
```

#### Comparing Client Cartridge to Specific Cartridges:

> If you only care about a couple of cartridges, you can speed things up by specifying which ones to compare against.

```bash
sfcc-diff --cartridge app_client_name --include storefront-reference-architecture,third_party_core
sfcc-diff -c app_client_name -i storefront-reference-architecture,third_party_core
```

#### Comparing Client Cartridge to All Cartridges Except Specific Ones:

> For when you want to compare your client cartridge to ALL cartridges, but want to leave a couple out.

```bash
sfcc-diff --cartridge app_client_name --exclude link_paypal,int_payeezy
sfcc-diff -c app_client_name -e link_paypal,int_payeezy
```

#### Comparing Client Cartridge to All Cartridges using Only Modified Files:

> Limit compare to just the modified files from your client `--cartridge` in your current git commit.

```bash
sfcc-diff --cartridge app_client_name --modified-only
sfcc-diff -c app_client_name -m
```

#### Comparing Client Cartridge to All Cartridges and just show Junk Files:

> Sometimes a file gets copied over to override another cartridge, but ends up not being modified.  These junk files are normally hard to catch via `git` since the file is technically new.

```bash
sfcc-diff --cartridge app_client_name --junk-only
sfcc-diff -c app_client_name -j
```

#### Comparing Client Cartridge to All Cartridges and Filtering for ISML Files:

> If you want to limit the results to just what matches a filter, you can use the `--filter` flag.  This will match on the entire relative URL, not just the file name.

```bash
sfcc-diff --cartridge app_client_name --filter .isml
sfcc-diff -c app_client_name -f .isml
```

#### Comparing Client Cartridge to Specific Cartridge and Generate Diff:

> Want to actually see the changes between cartridge files? Just pass in a the Diff option and it will render it in your terminal window.

```bash
sfcc-diff --cartridge app_client_name --include storefront-reference-architecture --diff
sfcc-diff -c app_client_name -i storefront-reference-architecture -d
```

#### Comparing Client Cartridge to Specific Cartridge and Generate Diff in External App:

> Want to use an existing Diff Tool to generate the diff instead of displaying it in your terminal window? Just pass in the name of a tool you already have configured with git.

```bash
sfcc-diff --cartridge app_client_name --include storefront-reference-architecture --diff=ksdiff
sfcc-diff -c app_client_name -i storefront-reference-architecture -d ksdiff
```

**NOTE:** In order to use an external app, you will need to have one configured in your `~/.gitconfig` file.

Here are a couple of apps you can use for external diffs, and how to configure them.

**[ksdiff](https://kaleidoscope.app/ksdiff2)** - Kaleidoscope

```ini
[difftool "ksdiff"]
  prompt = false
  trustExitCode = true
  cmd = ksdiff --partial-changeset --relative-path \"$MERGED\" -- \"$LOCAL\" \"$REMOTE\"
```

**[bcomp](https://www.scootersoftware.com/download.php)** - Beyond Compare

```ini
[difftool "bcomp"]
  prompt = false
  trustExitCode = true
  cmd = bcompare -solo \"$LOCAL\" \"$REMOTE\"
```

**[meld](http://meldmerge.org/)** - Meld

```ini
[difftool "meld"]
  prompt = false
  trustExitCode = true
  cmd = meld --newtab --label=\"$MERGED\" \"$LOCAL\" \"$REMOTE\" &> /dev/null &
```

**[kdiff3](http://kdiff3.sourceforge.net/)** - KDiff3

```ini
[difftool "kdiff3"]
  prompt = false
  trustExitCode = true
  cmd = open -W -a kdiff3 -n --args \"$LOCAL\" \"$REMOTE\" &> /dev/null &
```

About the Author
---

> [Peter Schmalfeldt](https://peterschmalfeldt.com/) is a Certified Senior Salesforce Commerce Cloud Developer with over 20 years of experience building eCommerce websites, providing everything you need to design, develop & deploy eCommerce applications for Web, Mobile & Desktop platforms.

Disclaimer
---

> The trademarks and product names of Salesforce®, including the mark Salesforce®, are the property of Salesforce.com. SFCC DevOps is not affiliated with Salesforce.com, nor does Salesforce.com sponsor or endorse the SFCC DevOps products or website. The use of the Salesforce® trademark on this project does not indicate an endorsement, recommendation, or business relationship between Salesforce.com and SFCC DevOps.
