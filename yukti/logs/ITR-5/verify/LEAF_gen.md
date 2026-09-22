# ITR-5 · LEAF-COVERAGE CHECK — AREA `gen`

**Schema:** `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (V1.1, AY 2026-27)  
**Blocks audited:** `ITR5.PartA_GEN1` (`OrgFirmInfo`, `FilingStatus` and everything nested), `ITR5.PartA_GEN2` (audit half, `AuditInfo`, `AuditDetails92E`, the two audit tables, partners/members, private-discretionary-trust, `NatOfBus`), `ITR5.CreationInfo`, `ITR5.Form_ITR5`  
**`PartA_GEN2For5`:** does not exist in this schema — `definitions` has exactly one GEN-2 block, `PartA_GEN2`, and it is the ITR-5 variant (`grep` over the 257 definitions returns `PartA_GEN1`, `PartA_GEN2` only). Nothing to audit under that name.  
**Built software checked:** `forms/ITR-5/Yukti_ITR5.html` (assembled) and `forms/ITR-5/src/70_sec_gen.js`; skeleton `forms/ITR-5/src/10_state.js` (`SKEL`); driver `forms/ITR-5/src/90_wiring.js` (`buildReturn`).  
**Leaves enumerated:** 181 (PartA_GEN1 106 · PartA_GEN2 64 · CreationInfo 6 · Form_ITR5 5) — walked from the schema resolving `$ref` **and `allOf`** against `definitions`, recursing `properties`/`items`; a leaf is a property with no nested `properties`/`items`.

> **Assembly verified:** the whole of `70_sec_gen.js` is present verbatim inside `Yukti_ITR5.html` (byte-for-byte containment check), so every line reference below is live in the shipped form.
> `inp(p,…)` and `sel(p,…)` emit `data-p="p"`; `dte(p)` is `inp(p,…)`; `grid(key,cols,…)` emits `data-p="key.<i>.<col.k>"` (`shell/shell.js:71-96`). `set()` auto-vivifies dotted paths (`shell/shell.js:28-30`), so `pm.trust.*` reaches state.
> **Sole writer:** a grep of every `forms/ITR-5/src/*.js` shows `expGen` is the only function that *writes* `PartA_GEN1`/`PartA_GEN2`; all other hits (`61_rules_enc_*.js`) only read them. `CreationInfo`/`Form_ITR5` are written by nothing but the `SKEL` copy in `buildReturn()`.

## Result

### ✅ ZERO ORPHANS — and zero required-leaf orphans.

All 181 leaves are written by `expGen(j)` (a mechanical diff of the schema leaf set against the set of `put(j,"…")` / `putArr(…)` / array-literal targets leaves an empty remainder), and 169 of them are reachable from a real `data-p` field on screen. The 12 that are not are the 11 no-screen meta constants plus the fixed mobile country code — all deliberate, all cited below.

| bucket | count |
|---|---:|
| INPUT | 169 |
| COMPUTED | 12 |
| NA | 0 |
| ORPHAN | 0 |
| **total** | **181** |

| block | leaves | INPUT | COMPUTED | NA | ORPHAN | hard-required | required-in-parent |
|---|---:|---:|---:|---:|---:|---:|---:|
| `PartA_GEN1` | 106 | 105 | 1 | 0 | 0 | 25 | 18 |
| `PartA_GEN2` | 64 | 64 | 0 | 0 | 0 | 5 | 26 |
| `CreationInfo` | 6 | 0 | 6 | 0 | 0 | 6 | 0 |
| `Form_ITR5` | 5 | 0 | 5 | 0 | 0 | 5 | 0 |
| **all four** | **181** | **169** | **12** | **0** | **0** | **41** | **44** |

*"hard-required" = the leaf is in a `required` list and so is every ancestor object up to the root, i.e. the JSON is schema-invalid without it. "required-in-parent" = required only once its optional parent object/array row is present.*

## ORPHAN list

**Required-leaf orphans: _none_.**  
**Optional-leaf orphans: _none_.**

All 41 hard-required leaves are additionally pre-seeded at a schema-valid default in `SKEL` (`10_state.js:28-96`), which `buildReturn()` deep-copies before any `exp()` runs — so even a completely untouched form emits a structurally valid `PartA_GEN1`/`PartA_GEN2`/`CreationInfo`/`Form_ITR5`.

---

## ⚠ Defects found that are NOT orphans (the leaf has a home, but the home is wrong)

These are not ORPHANs by the brief's definition — there *is* a way to enter them and an export *does* write them — but each will produce a schema-invalid or unfilable value. Listed loudest-first.

### D1 (serious) — `PartA_GEN2.BiiDetails.44AD / .44ADA / .44AE / .44BB` are built as free-text turnover boxes, but the schema wants `Y|N`

```js
// forms/ITR-5/src/70_sec_gen.js:370-373
      h+=row("Turnover u/s 44AD",inp("aud.bii44AD",{max:30}),{ref:"BiiDetails.44AD",ind:1});
      h+=row("Turnover u/s 44ADA",inp("aud.bii44ADA",{max:30}),{ref:"BiiDetails.44ADA",ind:1});
      h+=row("Turnover u/s 44AE",inp("aud.bii44AE",{max:30}),{ref:"BiiDetails.44AE",ind:1});
      h+=row("Turnover u/s 44BB",inp("aud.bii44BB",{max:30}),{ref:"BiiDetails.44BB",ind:1});
```

Schema (`definitions.PartA_GEN2.properties.BiiDetails`): each of the four is `{"type":"string","pattern":"Y|N"}`. They are the *tick-boxes* for condition b(ii) — "assessee falling u/s 44AD/44ADA/44AE/44BB but **not** opting to offer income on a presumptive basis" (`Cndnfor44AB` description in the schema; `books/ITR-5/PART_A_GENERAL.md:507`) — not amounts. `expGen` writes whatever the user typed (`oPut2(j,"PartA_GEN2.BiiDetails.44AD",sv(S.aud.bii44AD))`, L606-608). A filer entering a turnover figure produces JSON the department will reject. **Fix: make the four `sel(...,GEN_YN)` and relabel to "Falling u/s 44AD?" etc.**

### D2 (moderate) — questions B / C / D are silently dropped when the member grid is empty

```js
// forms/ITR-5/src/70_sec_gen.js:639-643
  if(mem.length){                                             /* questions B/C/D ride on the first member row (book §2 of GEN2) */
    if(S.pm.bForeign)mem[0].PartnerForeignCompFlg=st0(S.pm.bForeign);
    if(S.pm.bForeign==="YES"&&st0(S.pm.cPct)!=="")mem[0].PercentageOfShareForeignComp=N(S.pm.cPct);
    if(S.pm.dExceeds)mem[0].TotIncFrmMemberOfAop=st0(S.pm.dExceeds);
    put(j,"PartA_GEN2.PartnerOrMemberInfo",mem);
  }
```

`PartnerForeignCompFlg` (K8), `PercentageOfShareForeignComp` (K9) and `TotIncFrmMemberOfAop` (K10) are per-schema properties of `PartnerOrMemberInfo[]`, and the form does place them on `[0]` — correct. But if the filer answers B/C/D and has not yet added a Table-E row, the three answers vanish from the JSON with no warning. The schema offers no other carrier, so this is a UX/validation gap rather than a schema gap; `chkGen()` should require ≥1 member row whenever B or D is answered.

### D3 (minor) — `OrgFirmInfo.Address.CountryCodeMobile` is hard-wired to `91`

`put(j,"PartA_GEN1.OrgFirmInfo.Address.CountryCodeMobile",91)` (L496). The leaf is **hard-required** and schema-valid at 91, and the utility itself has a single mobile cell `T24` driving both keys (`books/ITR-5/PART_A_GENERAL.md:62`), so this matches the source of truth. But the *secondary* mobile does expose a code box (`pi.mobile2Cc`, L215) while the primary does not — a non-resident firm with a foreign primary mobile cannot file its real code. Classified COMPUTED, not ORPHAN.

### D4 (minor) — `CreationInfo.JSONCreationDate` is a frozen constant `"2026-01-01"`

`SKEL.CreationInfo.JSONCreationDate = "2026-01-01"` (`10_state.js:34`) and nothing overwrites it — `buildReturn()` only deep-copies `SKEL` and then runs the section `exp()`s, none of which touch `CreationInfo`. Every JSON the software has ever produced claims to have been created on 1 January 2026. Schema-valid (the pattern is just `YYYY-MM-DD`), but wrong in fact and a likely portal flag. Same file also carries `SWCreatedBy`/`JSONCreatedBy = "SW10000000"` while `FORM.sw` in `00_form.js:35` is `"SW10000001"` — the two disagree; the export uses the `SKEL` value.

### D5 (cosmetic) — `pi.llpin` accepts 20 characters, schema pattern is `[A-Z0-9-]{8}`

`inp("pi.llpin",{max:20})` (L172) vs `LLPINissuedByMCA: {"pattern":"[A-Z0-9-]{8}"}`. The member-grid twin `dpin` is correctly capped at 8. Not an orphan; a `maxlength` fix.

---

## Enum / code-table coverage (every restricted leaf in this area)

Each screen dropdown was diffed value-by-value against its schema `enum`/`pattern`. **No leaf offers fewer values than the schema allows, and none offers a value the schema rejects.**

| leaf | schema values | screen table | missing | extra |
|---|---:|---|---:|---:|
| `Address.StateCode` / `AlternateAddress.StateCode` / `PartnerOrMemberInfo[].…StateCode` | 38 | `GEN_STATE` (L34) | 0 | 0 |
| `Address.CountryCode` / `AlternateAddress.CountryCode` / `PartnerOrMemberInfo[].…CountryCode` | 250 | `GEN_COUNTRY` (L35) | 0 | 0 |
| `OrgFirmInfo.StatusOrCompanyType` | 4 | `GEN_STATUS` (L41) | 0 | 0 |
| `OrgFirmInfo.SubStatus` | 14 (pattern) | `GEN_SUBSTATUS` + `GEN_SUBSTATUS_CODE` (L43-62) | 0 | 0 |
| `FilingStatus.ReturnFileSec.IncomeTaxSec` | 9 | `GEN_SEC` (L66) | 0 | 0 |
| `FilingStatus.ItrFilingDueDate` | 4 | `GEN_DUE` (L67) | 0 | 0 |
| `FilingStatus.ReturnFileSec.Section115BADAY` | 5 | `GEN_BADAY` (L72) | 0 | 0 |
| `PartA_GEN2.AuditDetails[].AuditedSection` | 15 | `GEN_AUDSEC` (L76) | 0 | 0 |
| `PartA_GEN2.AuditReportDetails[].AuditReportAct` | 18 | `GEN_AUDACT` (L77) | 0 | 0 |
| `PartA_GEN2.PartnerOrMemberInfo[].Status` | 18 | `GEN_PMSTATUS` (L36) | 0 | 0 |
| `PartA_GEN2.NatOfBus.NatureOfBusiness[].Code` | 371 | `GEN_NOB` (L37) | 0 | 0 |
| all `Y|N` flags · `NriSEPinIndia` · `TotalSalesExcOneCr` · `AgrOFAll*` · `Cndnfor44AB` · `CompanyType` · `AdmRet` · `PartnerForeignCompFlg` · `OptingNewTaxRegime` · `Form10IEAAssYear` · `AssYrF10IEANewTaxReg` | 2-3 each | `GEN_YN`/`GEN_SEP`/`GEN_SALES`/`GEN_PCT5`/`GEN_CND44AB`/`GEN_COTYPE`/`GEN_ADMRET`/`GEN_BYN`/`GEN_OPTNEW`/`GEN_AYOLD`/`GEN_AYNEW` (L64-80) | 0 | 0 |

`OrgFirmInfo.SubStatus` footnote: the schema pattern admits exactly the 14 codes `4,5,8,10,11,12,13,15,16,17,18,19,20,21`, and `GEN_SUBSTATUS_CODE` maps exactly those 14. The one screen label with no schema code is "1-Local Authority" (Status `2`), which the export deliberately omits — the leaf is optional, so this is legitimate and is **not** counted as NA because the leaf itself is covered by the other 14 codes (`70_sec_gen.js:48-53` comment; `books/ITR-5/PART_A_GENERAL.md` §10 "Status → Sub-status dropdown is dependent (AH12 formula)").

## Round-trip (import) coverage

`impGen(I5)` (L663-789) reads **180 of the 181** leaves back into state. The one exception is `Address.CountryCodeMobile`, which is intentionally not imported because it is a constant on export (D3). No leaf is exported-but-unreadable in any other place, so an imported JSON re-exports identically.

---

## Per-leaf table

`data-p` values are the literal attribute the shipped HTML emits. `L<n>` = line in `forms/ITR-5/src/70_sec_gen.js` unless another file is named. Grid columns are written `key.&lt;i&gt;.col`, where `<i>` is the row index the shell substitutes.

### `ITR5.PartA_GEN1` — 106 leaves

| leaf | schema path | required? | class | evidence |
|---|---|:-:|:-:|---|
| `SurNameOrOrgName` | `PartA_GEN1.OrgFirmInfo.AssesseeName.SurNameOrOrgName` | **REQ** | INPUT | `data-p="pi.name"` (70_sec_gen.js:L169); exported `put(j,"PartA_GEN1.OrgFirmInfo.AssesseeName.SurNameOrOrgName",sv(S.pi.name))` L479 |
| `OrgOldName` | `PartA_GEN1.OrgFirmInfo.AssesseeName.OrgOldName` | — | INPUT | `data-p="pi.oldName"` (70_sec_gen.js:L170); exported `put(j,"PartA_GEN1.OrgFirmInfo.AssesseeName.OrgOldName",sv(S.pi.oldName))` L480 |
| `PAN` | `PartA_GEN1.OrgFirmInfo.PAN` | **REQ** | INPUT | `data-p="pi.pan"` (70_sec_gen.js:L171); exported `put(j,"PartA_GEN1.OrgFirmInfo.PAN",sv(S.pi.pan&&String(S.pi.pan).toUpperCase()))` L481 |
| `LLPINissuedByMCA` | `PartA_GEN1.OrgFirmInfo.LLPINissuedByMCA` | — | INPUT | `data-p="pi.llpin"` (70_sec_gen.js:L172); exported `put(j,"PartA_GEN1.OrgFirmInfo.LLPINissuedByMCA",sv(S.pi.llpin))` L482 |
| `ResidenceNo` | `PartA_GEN1.OrgFirmInfo.Address.ResidenceNo` | **REQ** | INPUT | `data-p="pi.addr1"` (70_sec_gen.js:L180); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.ResidenceNo",sv(S.pi.addr1))` L483 |
| `ResidenceName` | `PartA_GEN1.OrgFirmInfo.Address.ResidenceName` | — | INPUT | `data-p="pi.premises"` (70_sec_gen.js:L181); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.ResidenceName",sv(S.pi.premises))` L484 |
| `RoadOrStreet` | `PartA_GEN1.OrgFirmInfo.Address.RoadOrStreet` | — | INPUT | `data-p="pi.road"` (70_sec_gen.js:L182); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.RoadOrStreet",sv(S.pi.road))` L485 |
| `LocalityOrArea` | `PartA_GEN1.OrgFirmInfo.Address.LocalityOrArea` | **REQ** | INPUT | `data-p="pi.locality"` (70_sec_gen.js:L183); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.LocalityOrArea",sv(S.pi.locality))` L486 |
| `CityOrTownOrDistrict` | `PartA_GEN1.OrgFirmInfo.Address.CityOrTownOrDistrict` | **REQ** | INPUT | `data-p="pi.city"` (70_sec_gen.js:L184); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.CityOrTownOrDistrict",sv(S.pi.city))` L487 |
| `StateCode` | `PartA_GEN1.OrgFirmInfo.Address.StateCode` | **REQ** | INPUT | `data-p="pi.state"` (70_sec_gen.js:L187); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.StateCode",sv(india?S.pi.state:"99"))` L488 |
| `CountryCode` | `PartA_GEN1.OrgFirmInfo.Address.CountryCode` | **REQ** | INPUT | `data-p="pi.country"` (70_sec_gen.js:L185); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.CountryCode",sv(S.pi.country||"91"))` L489 |
| `PinCode` | `PartA_GEN1.OrgFirmInfo.Address.PinCode` | — | INPUT | `data-p="pi.pin"` (70_sec_gen.js:L188); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.PinCode",R(S.pi.pin))` L490 |
| `ZipCode` | `PartA_GEN1.OrgFirmInfo.Address.ZipCode` | — | INPUT | `data-p="pi.zip"` (70_sec_gen.js:L191); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.ZipCode",sv(S.pi.zip))` L491 |
| `STDcode` | `PartA_GEN1.OrgFirmInfo.Address.Phone.STDcode` | req-in-parent | INPUT | `data-p="pi.std"` (70_sec_gen.js:L212); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.Phone.STDcode",R(S.pi.std))` L493 |
| `PhoneNo` | `PartA_GEN1.OrgFirmInfo.Address.Phone.PhoneNo` | req-in-parent | INPUT | `data-p="pi.phone"` (70_sec_gen.js:L213); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.Phone.PhoneNo",R(S.pi.phone))` L494 |
| `CountryCodeMobile` | `PartA_GEN1.OrgFirmInfo.Address.CountryCodeMobile` | **REQ** | COMPUTED | constant `91` written by expGen (`put(j,"...CountryCodeMobile",91)`, 70_sec_gen.js:L496). The utility has one mobile cell T24 that drives both keys (PART_A_GENERAL.md:62), so no screen field exists; a non-91 code cannot be filed. |
| `MobileNo` | `PartA_GEN1.OrgFirmInfo.Address.MobileNo` | **REQ** | INPUT | `data-p="pi.mobile"` (70_sec_gen.js:L214); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.MobileNo",R(S.pi.mobile))` L497 |
| `CountryCodeMobileNoSec` | `PartA_GEN1.OrgFirmInfo.Address.CountryCodeMobileNoSec` | — | INPUT | `data-p="pi.mobile2Cc"` (70_sec_gen.js:L215); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.CountryCodeMobileNoSec",R(S.pi.mobile2Cc||91))` L498 |
| `MobileNoSec` | `PartA_GEN1.OrgFirmInfo.Address.MobileNoSec` | — | INPUT | `data-p="pi.mobile2"` (70_sec_gen.js:L215); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.MobileNoSec",R(S.pi.mobile2))` L499 |
| `EmailAddress` | `PartA_GEN1.OrgFirmInfo.Address.EmailAddress` | **REQ** | INPUT | `data-p="pi.email"` (70_sec_gen.js:L216); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.EmailAddress",sv(S.pi.email))` L500 |
| `EmailAddressSecondary` | `PartA_GEN1.OrgFirmInfo.Address.EmailAddressSecondary` | — | INPUT | `data-p="pi.email2"` (70_sec_gen.js:L217); exported `put(j,"PartA_GEN1.OrgFirmInfo.Address.EmailAddressSecondary",sv(S.pi.email2))` L501 |
| `SecondaryAdd` | `PartA_GEN1.OrgFirmInfo.SecondaryAdd` | — | INPUT | `data-p="pi.addr2same"` (70_sec_gen.js:L195); exported `put(j,"PartA_GEN1.OrgFirmInfo.SecondaryAdd",sv(S.pi.addr2same||"Y"))` L502 |
| `ResidenceNo` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.ResidenceNo` | req-in-parent | INPUT | `data-p="pi.addr1b"` (70_sec_gen.js:L198); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.ResidenceNo",sv(S.pi.addr1b))` L504 |
| `ResidenceName` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.ResidenceName` | — | INPUT | `data-p="pi.premisesb"` (70_sec_gen.js:L199); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.ResidenceName",sv(S.pi.premisesb))` L505 |
| `RoadOrStreet` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.RoadOrStreet` | — | INPUT | `data-p="pi.roadb"` (70_sec_gen.js:L200); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.RoadOrStreet",sv(S.pi.roadb))` L506 |
| `LocalityOrArea` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.LocalityOrArea` | req-in-parent | INPUT | `data-p="pi.localityb"` (70_sec_gen.js:L201); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.LocalityOrArea",sv(S.pi.localityb))` L507 |
| `CityOrTownOrDistrict` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.CityOrTownOrDistrict` | req-in-parent | INPUT | `data-p="pi.cityb"` (70_sec_gen.js:L202); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.CityOrTownOrDistrict",sv(S.pi.cityb))` L508 |
| `StateCode` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.StateCode` | req-in-parent | INPUT | `data-p="pi.stateb"` (70_sec_gen.js:L204); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.StateCode",sv(ib?S.pi.stateb:"99"))` L509 |
| `CountryCode` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.CountryCode` | — | INPUT | `data-p="pi.countryb"` (70_sec_gen.js:L203); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.CountryCode",sv(S.pi.countryb||"91"))` L510 |
| `PinCode` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.PinCode` | — | INPUT | `data-p="pi.pinb"` (70_sec_gen.js:L205); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.PinCode",R(S.pi.pinb))` L511 |
| `ZipCode` | `PartA_GEN1.OrgFirmInfo.AlternateAddress.ZipCode` | — | INPUT | `data-p="pi.zipb"` (70_sec_gen.js:L207); exported `put(j,"PartA_GEN1.OrgFirmInfo.AlternateAddress.ZipCode",sv(S.pi.zipb))` L512 |
| `DateOFFormOrIncorp` | `PartA_GEN1.OrgFirmInfo.DateOFFormOrIncorp` | **REQ** | INPUT | `data-p="pi.formed"` (70_sec_gen.js:L175); exported `put(j,"PartA_GEN1.OrgFirmInfo.DateOFFormOrIncorp",ISO(S.pi.formed))` L514 |
| `DateofBusCommencement` | `PartA_GEN1.OrgFirmInfo.DateofBusCommencement` | — | INPUT | `data-p="pi.bizStart"` (70_sec_gen.js:L176); exported `put(j,"PartA_GEN1.OrgFirmInfo.DateofBusCommencement",ISO(S.pi.bizStart))` L515 |
| `StatusOrCompanyType` | `PartA_GEN1.OrgFirmInfo.StatusOrCompanyType` | **REQ** | INPUT | `data-p="pi.status"` (70_sec_gen.js:L173); exported `put(j,"PartA_GEN1.OrgFirmInfo.StatusOrCompanyType",sv(S.pi.status||"1"))` L516 |
| `SubStatus` | `PartA_GEN1.OrgFirmInfo.SubStatus` | — | INPUT | `data-p="pi.substatus"` (dependent `sel()` filtered by Status, L174); expGen maps the utility label to the schema code via `GEN_SUBSTATUS_CODE` (L517). All 14 codes of the schema pattern `4|5|8|10|11|12|13|15|16|17|18|19|20|21` are reachable; "Local Authority" has no code and is omitted (leaf is optional). |
| `IncomeTaxSec` | `PartA_GEN1.FilingStatus.ReturnFileSec.IncomeTaxSec` | **REQ** | INPUT | `data-p="fs.sec"` (`sel(...,GEN_SEC)`, L222); expGen `put(...,R(sec||11))` L520. All 9 schema enum values offered. |
| `NoticeNo` | `PartA_GEN1.FilingStatus.ReturnFileSec.NoticeNo` | — | INPUT | `data-p="fs.noticeNo"` (70_sec_gen.js:L224); exported `put(j,"PartA_GEN1.FilingStatus.ReturnFileSec.NoticeNo",sv(S.fs.noticeNo))` L522 |
| `NoticeDate` | `PartA_GEN1.FilingStatus.ReturnFileSec.NoticeDate` | — | INPUT | `data-p="fs.noticeDate"` (70_sec_gen.js:L225); exported `put(j,"PartA_GEN1.FilingStatus.ReturnFileSec.NoticeDate",ISO(S.fs.noticeDate))` L523 |
| `NewTaxRegime` | `PartA_GEN1.FilingStatus.ReturnFileSec.NewTaxRegime` | — | INPUT | `data-p="fs.newTaxRegime"` (70_sec_gen.js:L265); exported `put(j,"PartA_GEN1.FilingStatus.ReturnFileSec.NewTaxRegime",sv(S.fs.newTaxRegime))` L541 |
| `OptingNewTaxRegime` | `PartA_GEN1.FilingStatus.ReturnFileSec.OptingNewTaxRegime` | — | INPUT | `data-p="fs.optNew"` (70_sec_gen.js:L271); exported `put(j,"PartA_GEN1.FilingStatus.ReturnFileSec.OptingNewTaxRegime",R(S.fs.optNew))` L548 |
| `Section115BADAY` | `PartA_GEN1.FilingStatus.ReturnFileSec.Section115BADAY` | — | INPUT | `data-p="fs.bad115AY"` (70_sec_gen.js:L267); exported `put(j,"PartA_GEN1.FilingStatus.ReturnFileSec.Section115BADAY",sv(S.fs.bad115AY))` L546 |
| `Form10IFDate` | `PartA_GEN1.FilingStatus.ReturnFileSec.Form10IFDate` | — | INPUT | `data-p="fs.form10IFDate"` (70_sec_gen.js:L268); exported `put(j,"PartA_GEN1.FilingStatus.ReturnFileSec.Form10IFDate",ISO(S.fs.form10IFDate))` L550 |
| `Form10IFAckNo` | `PartA_GEN1.FilingStatus.ReturnFileSec.Form10IFAckNo` | — | INPUT | `data-p="fs.form10IFAck"` (70_sec_gen.js:L269); exported `put(j,"PartA_GEN1.FilingStatus.ReturnFileSec.Form10IFAckNo",R(S.fs.form10IFAck))` L551 |
| `IncFrmBusOrProf` | `PartA_GEN1.FilingStatus.IncFrmBusOrProf` | — | INPUT | `data-p="fs.incBP"` (70_sec_gen.js:L234); exported `put(j,"PartA_GEN1.FilingStatus.IncFrmBusOrProf",sv(S.fs.incBP||"Y"))` L525 |
| `Form10IEAAssYear` | `PartA_GEN1.FilingStatus.Form10IEAAssYear` | — | INPUT | `data-p="fs.f10ieaEarlierAY"` (70_sec_gen.js:L249); exported `put(j,"PartA_GEN1.FilingStatus.Form10IEAAssYear",sv(S.fs.f10ieaEarlierAY))` L533 |
| `Form10IEAEarlierAYOldRegime` | `PartA_GEN1.FilingStatus.Form10IEAEarlierAYOldRegime` | — | INPUT | `data-p="fs.f10ieaEarlierOld"` (70_sec_gen.js:L246); exported `put(j,"PartA_GEN1.FilingStatus.Form10IEAEarlierAYOldRegime",sv(S.fs.f10ieaEarlierOld))` L531 |
| `Form10IEAEarlierAYAckOldRegime` | `PartA_GEN1.FilingStatus.Form10IEAEarlierAYAckOldRegime` | — | INPUT | `data-p="fs.f10ieaEarlierAckOld"` (70_sec_gen.js:L248); exported `put(j,"PartA_GEN1.FilingStatus.Form10IEAEarlierAYAckOldRegime",R(S.fs.f10ieaEarlierAckOld))` L532 |
| `F10IEAEarlierAYNewRegime` | `PartA_GEN1.FilingStatus.F10IEAEarlierAYNewRegime` | — | INPUT | `data-p="fs.f10ieaEarlierNew"` (70_sec_gen.js:L253); exported `put(j,"PartA_GEN1.FilingStatus.F10IEAEarlierAYNewRegime",sv(S.fs.f10ieaEarlierNew))` L535 |
| `AssYrF10IEANewTaxReg` | `PartA_GEN1.FilingStatus.AssYrF10IEANewTaxReg` | — | INPUT | `data-p="fs.f10ieaEarlierAYNew"` (70_sec_gen.js:L256); exported `put(j,"PartA_GEN1.FilingStatus.AssYrF10IEANewTaxReg",sv(S.fs.f10ieaEarlierAYNew))` L537 |
| `Form10IEAEarlierAYAckNewRegime` | `PartA_GEN1.FilingStatus.Form10IEAEarlierAYAckNewRegime` | — | INPUT | `data-p="fs.f10ieaEarlierAckNew"` (70_sec_gen.js:L255); exported `put(j,"PartA_GEN1.FilingStatus.Form10IEAEarlierAYAckNewRegime",R(S.fs.f10ieaEarlierAckNew))` L536 |
| `F10IEACurrAYNewRegime` | `PartA_GEN1.FilingStatus.F10IEACurrAYNewRegime` | — | INPUT | `data-p="fs.f10ieaCurrNew"` (70_sec_gen.js:L258); exported `put(j,"PartA_GEN1.FilingStatus.F10IEACurrAYNewRegime",sv(S.fs.f10ieaCurrNew))` L538 |
| `F10IEADateCurrAYNewTax` | `PartA_GEN1.FilingStatus.F10IEADateCurrAYNewTax` | — | INPUT | `data-p="fs.f10ieaDateNew"` (70_sec_gen.js:L260); exported `put(j,"PartA_GEN1.FilingStatus.F10IEADateCurrAYNewTax",ISO(S.fs.f10ieaDateNew))` L539 |
| `F10IEAAckNoCurrAYNewTax` | `PartA_GEN1.FilingStatus.F10IEAAckNoCurrAYNewTax` | — | INPUT | `data-p="fs.f10ieaAckNew"` (70_sec_gen.js:L261); exported `put(j,"PartA_GEN1.FilingStatus.F10IEAAckNoCurrAYNewTax",R(S.fs.f10ieaAckNew))` L540 |
| `F10IEACurrAYOldRegime` | `PartA_GEN1.FilingStatus.F10IEACurrAYOldRegime` | — | INPUT | `data-p="fs.f10ieaCurrOld"` (70_sec_gen.js:L241); exported `put(j,"PartA_GEN1.FilingStatus.F10IEACurrAYOldRegime",sv(S.fs.f10ieaCurrOld))` L528 |
| `F10IEADateCurrAYOldTax` | `PartA_GEN1.FilingStatus.F10IEADateCurrAYOldTax` | — | INPUT | `data-p="fs.f10ieaDateOld"` (70_sec_gen.js:L243); exported `put(j,"PartA_GEN1.FilingStatus.F10IEADateCurrAYOldTax",ISO(S.fs.f10ieaDateOld))` L529 |
| `F10IEAAckNoCurrAYOldTax` | `PartA_GEN1.FilingStatus.F10IEAAckNoCurrAYOldTax` | — | INPUT | `data-p="fs.f10ieaAckOld"` (70_sec_gen.js:L244); exported `put(j,"PartA_GEN1.FilingStatus.F10IEAAckNoCurrAYOldTax",R(S.fs.f10ieaAckOld))` L530 |
| `OptOldRegimeCurrAY` | `PartA_GEN1.FilingStatus.OptOldRegimeCurrAY` | — | INPUT | `data-p="fs.optout"` (Yes/No master switch, L239); expGen `put(...,old?"Y":"N")` L526. |
| `BusinessTrustFlag` | `PartA_GEN1.FilingStatus.BusinessTrustFlag` | **REQ** | INPUT | `data-p="fs.busTrust"` (70_sec_gen.js:L231); exported `put(j,"PartA_GEN1.FilingStatus.BusinessTrustFlag",sv(S.fs.busTrust||"N"))` L557 |
| `InvstmntFundRefrdSec115UB` | `PartA_GEN1.FilingStatus.InvstmntFundRefrdSec115UB` | **REQ** | INPUT | `data-p="fs.invFund"` (70_sec_gen.js:L232); exported `put(j,"PartA_GEN1.FilingStatus.InvstmntFundRefrdSec115UB",sv(S.fs.invFund||"N"))` L558 |
| `ReceiptNo` | `PartA_GEN1.FilingStatus.ReceiptNo` | — | INPUT | `data-p="fs.receiptNo"` (70_sec_gen.js:L228); exported `put(j,"PartA_GEN1.FilingStatus.ReceiptNo",R(S.fs.receiptNo))` L559 |
| `OrigRetFiledDate` | `PartA_GEN1.FilingStatus.OrigRetFiledDate` | — | INPUT | `data-p="fs.origDate"` (70_sec_gen.js:L229); exported `put(j,"PartA_GEN1.FilingStatus.OrigRetFiledDate",ISO(S.fs.origDate))` L560 |
| `ResidentialStatus` | `PartA_GEN1.FilingStatus.ResidentialStatus` | **REQ** | INPUT | `data-p="fs.resStatus"` (70_sec_gen.js:L233); exported `put(j,"PartA_GEN1.FilingStatus.ResidentialStatus",sv(S.fs.resStatus||"RES"))` L561 |
| `ForeignExchangeFlag` | `PartA_GEN1.FilingStatus.ForeignExchangeFlag` | **REQ** | INPUT | `data-p="fs.foreignExch"` (70_sec_gen.js:L310); exported `put(j,"PartA_GEN1.FilingStatus.ForeignExchangeFlag",sv(S.fs.foreignExch||"N"))` L562 |
| `StartUpDPIITFlag` | `PartA_GEN1.FilingStatus.StartUpDPIITFlag` | **REQ** | INPUT | `data-p="fs.startupDPIIT"` (70_sec_gen.js:L294); exported `put(j,"PartA_GEN1.FilingStatus.StartUpDPIITFlag",sv(S.fs.startupDPIIT||"N"))` L563 |
| `RecgnNumAllottedByDPIIT` | `PartA_GEN1.FilingStatus.RecgnNumAllottedByDPIIT` | — | INPUT | `data-p="fs.dpiitNum"` (70_sec_gen.js:L295); exported `put(j,"PartA_GEN1.FilingStatus.RecgnNumAllottedByDPIIT",sv(S.fs.dpiitNum))` L564 |
| `InterMinisterialCertFlag` | `PartA_GEN1.FilingStatus.InterMinisterialCertFlag` | **REQ** | INPUT | `data-p="fs.interMinCert"` (70_sec_gen.js:L296); exported `put(j,"PartA_GEN1.FilingStatus.InterMinisterialCertFlag",sv(S.fs.interMinCert||"N"))` L565 |
| `CertificationNumber` | `PartA_GEN1.FilingStatus.CertificationNumber` | — | INPUT | `data-p="fs.certNum"` (70_sec_gen.js:L297); exported `put(j,"PartA_GEN1.FilingStatus.CertificationNumber",sv(S.fs.certNum))` L566 |
| `ifMSME` | `PartA_GEN1.FilingStatus.ifMSME` | **REQ** | INPUT | `data-p="fs.ifMSME"` (70_sec_gen.js:L298); exported `put(j,"PartA_GEN1.FilingStatus.ifMSME",sv(S.fs.ifMSME||"N"))` L567 |
| `RegNumMSMEDAct2006` | `PartA_GEN1.FilingStatus.RegNumMSMEDAct2006` | — | INPUT | `data-p="fs.msmeNum"` (70_sec_gen.js:L299); exported `put(j,"PartA_GEN1.FilingStatus.RegNumMSMEDAct2006",sv(S.fs.msmeNum))` L568 |
| `NRI_PE` | `PartA_GEN1.FilingStatus.NRI_PE` | — | INPUT | `data-p="fs.nriPE"` (70_sec_gen.js:L301); exported `put(j,"PartA_GEN1.FilingStatus.NRI_PE",sv(S.fs.nriPE))` L569 |
| `NriSEPinIndia` | `PartA_GEN1.FilingStatus.NriSEPinIndia` | — | INPUT | `data-p="fs.nriSEP"` (70_sec_gen.js:L302); exported `put(j,"PartA_GEN1.FilingStatus.NriSEPinIndia",sv(S.fs.nriSEP))` L570 |
| `AggrPaymentTransac` | `PartA_GEN1.FilingStatus.AggrPaymentTransac` | — | INPUT | `data-p="fs.sepPay"` (70_sec_gen.js:L304); exported `put(j,"PartA_GEN1.FilingStatus.AggrPaymentTransac",N(S.fs.sepPay))` L571 |
| `NumberOfUsers` | `PartA_GEN1.FilingStatus.NumberOfUsers` | — | INPUT | `data-p="fs.sepUsers"` (70_sec_gen.js:L305); exported `put(j,"PartA_GEN1.FilingStatus.NumberOfUsers",N(S.fs.sepUsers))` L572 |
| `FiiFpiFlag` | `PartA_GEN1.FilingStatus.FiiFpiFlag` | **REQ** | INPUT | `data-p="fs.fpi"` (70_sec_gen.js:L308); exported `put(j,"PartA_GEN1.FilingStatus.FiiFpiFlag",sv(S.fs.fpi||"N"))` L573 |
| `SebiRegnNo` | `PartA_GEN1.FilingStatus.SebiRegnNo` | — | INPUT | `data-p="fs.sebi"` (70_sec_gen.js:L309); exported `put(j,"PartA_GEN1.FilingStatus.SebiRegnNo",sv(S.fs.sebi))` L574 |
| `AsseseeRepFlg` | `PartA_GEN1.FilingStatus.AsseseeRepFlg` | **REQ** | INPUT | `data-p="fs.rep"` (70_sec_gen.js:L313); exported `put(j,"PartA_GEN1.FilingStatus.AsseseeRepFlg",sv(S.fs.rep||"N"))` L575 |
| `RepName` | `PartA_GEN1.FilingStatus.AssesseeRep.RepName` | req-in-parent | INPUT | `data-p="fs.repName"` (70_sec_gen.js:L315); exported `put(j,"PartA_GEN1.FilingStatus.AssesseeRep.RepName",sv(S.fs.repName))` L576 |
| `RepEmailID` | `PartA_GEN1.FilingStatus.AssesseeRep.RepEmailID` | req-in-parent | INPUT | `data-p="fs.repEmail"` (70_sec_gen.js:L316); exported `put(j,"PartA_GEN1.FilingStatus.AssesseeRep.RepEmailID",sv(S.fs.repEmail))` L577 |
| `CountryCodeRepMobileNo` | `PartA_GEN1.FilingStatus.AssesseeRep.CountryCodeRepMobileNo` | req-in-parent | INPUT | `data-p="fs.repCc"` (70_sec_gen.js:L317); exported `put(j,"PartA_GEN1.FilingStatus.AssesseeRep.CountryCodeRepMobileNo",R(S.fs.repCc||91))` L578 |
| `RepMobileNo` | `PartA_GEN1.FilingStatus.AssesseeRep.RepMobileNo` | req-in-parent | INPUT | `data-p="fs.repMobile"` (70_sec_gen.js:L317); exported `put(j,"PartA_GEN1.FilingStatus.AssesseeRep.RepMobileNo",R(S.fs.repMobile))` L579 |
| `PartnerInFirmFlg` | `PartA_GEN1.FilingStatus.PartnerInFirmFlg` | **REQ** | INPUT | `data-p="fs.partner"` (70_sec_gen.js:L321); exported `put(j,"PartA_GEN1.FilingStatus.PartnerInFirmFlg",sv(S.fs.partner||"N"))` L580 |
| `NameOfFirm` | `PartA_GEN1.FilingStatus.PartnerInFirm.PartnerInFirmDtls[].NameOfFirm` | req-in-parent | INPUT | `data-p="pi.firms.&lt;i&gt;.name"` — grid `pi.firms` column `name`; exported at 70_sec_gen.js:L581 |
| `PAN` | `PartA_GEN1.FilingStatus.PartnerInFirm.PartnerInFirmDtls[].PAN` | req-in-parent | INPUT | `data-p="pi.firms.&lt;i&gt;.pan"` — grid `pi.firms` column `pan`; exported at 70_sec_gen.js:L581 |
| `HeldUnlistedEqShrPrYrFlg` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYrFlg` | **REQ** | INPUT | `data-p="fs.unl"` (70_sec_gen.js:L330); exported `put(j,"PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYrFlg",sv(S.fs.unl||"N"))` L584 |
| `NameOfCompany` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].NameOfCompany` | req-in-parent | INPUT | `data-p="pi.unlco.&lt;i&gt;.name"` — grid `pi.unlco` column `name`; exported at 70_sec_gen.js:L585 |
| `CompanyType` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].CompanyType` | req-in-parent | INPUT | `data-p="pi.unlco.&lt;i&gt;.type"` — grid `pi.unlco` column `type`; exported at 70_sec_gen.js:L585 |
| `PAN` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PAN` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.pan"` — grid `pi.unlco` column `pan`; exported at 70_sec_gen.js:L585 |
| `OpngBalNumberOfShares` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalNumberOfShares` | req-in-parent | INPUT | `data-p="pi.unlco.&lt;i&gt;.obNo"` — grid `pi.unlco` column `obNo`; exported at 70_sec_gen.js:L585 |
| `OpngBalCostOfAcquisition` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalCostOfAcquisition` | req-in-parent | INPUT | `data-p="pi.unlco.&lt;i&gt;.obCost"` — grid `pi.unlco` column `obCost`; exported at 70_sec_gen.js:L585 |
| `ShrAcqDurYrNumberOfShares` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrAcqDurYrNumberOfShares` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.acqNo"` — grid `pi.unlco` column `acqNo`; exported at 70_sec_gen.js:L585 |
| `DateOfSubscrPurchase` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].DateOfSubscrPurchase` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.subDate"` — grid `pi.unlco` column `subDate`; exported at 70_sec_gen.js:L585 |
| `FaceValuePerShare` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].FaceValuePerShare` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.faceVal"` — grid `pi.unlco` column `faceVal`; exported at 70_sec_gen.js:L585 |
| `IssuePricePerShare` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].IssuePricePerShare` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.issuePrice"` — grid `pi.unlco` column `issuePrice`; exported at 70_sec_gen.js:L585 |
| `PurchasePricePerShare` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PurchasePricePerShare` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.purchPrice"` — grid `pi.unlco` column `purchPrice`; exported at 70_sec_gen.js:L585 |
| `ShrTrnfNumberOfShares` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfNumberOfShares` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.trnfNo"` — grid `pi.unlco` column `trnfNo`; exported at 70_sec_gen.js:L585 |
| `ShrTrnfSaleConsideration` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfSaleConsideration` | — | INPUT | `data-p="pi.unlco.&lt;i&gt;.trnfCons"` — grid `pi.unlco` column `trnfCons`; exported at 70_sec_gen.js:L585 |
| `ClsngBalNumberOfShares` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalNumberOfShares` | req-in-parent | INPUT | `data-p="pi.unlco.&lt;i&gt;.cbNo"` — grid `pi.unlco` column `cbNo`; exported at 70_sec_gen.js:L585 |
| `ClsngBalCostOfAcquisition` | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalCostOfAcquisition` | req-in-parent | INPUT | `data-p="pi.unlco.&lt;i&gt;.cbCost"` — grid `pi.unlco` column `cbCost`; exported at 70_sec_gen.js:L585 |
| `115BAEReturnFiling_24_25` | `PartA_GEN1.FilingStatus.115BAEReturnFiling_24_25` | — | INPUT | `data-p="fs.baeReturn"` (70_sec_gen.js:L279); exported `put(j,"PartA_GEN1.FilingStatus.115BAEReturnFiling_24_25",sv(S.fs.baeReturn))` L552 |
| `OptingTaxation115BAEYes` | `PartA_GEN1.FilingStatus.OptingTaxation115BAEYes` | — | INPUT | `data-p="fs.baeYes"` (70_sec_gen.js:L281); exported `put(j,"PartA_GEN1.FilingStatus.OptingTaxation115BAEYes",sv(S.fs.baeYes))` L553 |
| `OptingTaxation115BAENo` | `PartA_GEN1.FilingStatus.OptingTaxation115BAENo` | — | INPUT | `data-p="fs.baeNo"` (70_sec_gen.js:L283); exported `put(j,"PartA_GEN1.FilingStatus.OptingTaxation115BAENo",sv(S.fs.baeNo))` L554 |
| `Form10IFADate` | `PartA_GEN1.FilingStatus.Form10IFADate` | — | INPUT | `data-p="fs.form10IFADate"` (70_sec_gen.js:L286); exported `put(j,"PartA_GEN1.FilingStatus.Form10IFADate",ISO(S.fs.form10IFADate))` L555 |
| `Form10IFAAckNo` | `PartA_GEN1.FilingStatus.Form10IFAAckNo` | — | INPUT | `data-p="fs.form10IFAAck"` (70_sec_gen.js:L287); exported `put(j,"PartA_GEN1.FilingStatus.Form10IFAAckNo",R(S.fs.form10IFAAck))` L556 |
| `LEINumber` | `PartA_GEN1.FilingStatus.LEIDtls.LEINumber` | — | INPUT | `data-p="fs.lei"` (70_sec_gen.js:L352); exported `put(j,"PartA_GEN1.FilingStatus.LEIDtls.LEINumber",sv(String(S.fs.lei).toUpperCase()))` L594 |
| `ValidUptoDate` | `PartA_GEN1.FilingStatus.LEIDtls.ValidUptoDate` | — | INPUT | `data-p="fs.leiValid"` (70_sec_gen.js:L353); exported `put(j,"PartA_GEN1.FilingStatus.LEIDtls.ValidUptoDate",ISO(S.fs.leiValid))` L595 |
| `ItrFilingDueDate` | `PartA_GEN1.FilingStatus.ItrFilingDueDate` | **REQ** | INPUT | `data-p="fs.duedate"` (70_sec_gen.js:L221); exported `put(j,"PartA_GEN1.FilingStatus.ItrFilingDueDate",sv(S.fs.duedate||"2026-08-31"))` L596 |

### `ITR5.PartA_GEN2` — 64 leaves

| leaf | schema path | required? | class | evidence |
|---|---|:-:|:-:|---|
| `LiableSec44AAflg` | `PartA_GEN2.LiableSec44AAflg` | **REQ** | INPUT | `data-p="aud.sec44AA"` (70_sec_gen.js:L357); exported `put(j,"PartA_GEN2.LiableSec44AAflg",sv(S.aud.sec44AA||"N"))` L599 |
| `IncDclrdUs` | `PartA_GEN2.IncDclrdUs` | **REQ** | INPUT | `data-p="aud.incDclrdUs"` (70_sec_gen.js:L358); exported `put(j,"PartA_GEN2.IncDclrdUs",sv(S.aud.incDclrdUs||"N"))` L600 |
| `TotalSalesExcOneCr` | `PartA_GEN2.TotalSalesExcOneCr` | — | INPUT | `data-p="aud.salesBand"` (70_sec_gen.js:L360); exported `put(j,"PartA_GEN2.TotalSalesExcOneCr",sv(S.aud.salesBand))` L601 |
| `AgrOFAllAmtsRcvd` | `PartA_GEN2.AgrOFAllAmtsRcvd` | — | INPUT | `data-p="aud.pctRcvd"` (70_sec_gen.js:L362); exported `put(j,"PartA_GEN2.AgrOFAllAmtsRcvd",sv(S.aud.pctRcvd))` L602 |
| `AgrOFAllPayMade` | `PartA_GEN2.AgrOFAllPayMade` | — | INPUT | `data-p="aud.pctPaid"` (70_sec_gen.js:L363); exported `put(j,"PartA_GEN2.AgrOFAllPayMade",sv(S.aud.pctPaid))` L603 |
| `LiableSec44ABflg` | `PartA_GEN2.LiableSec44ABflg` | **REQ** | INPUT | `data-p="aud.sec44AB"` (70_sec_gen.js:L366); exported `put(j,"PartA_GEN2.LiableSec44ABflg",sv(S.aud.sec44AB||"N"))` L604 |
| `Cndnfor44AB` | `PartA_GEN2.Cndnfor44AB` | — | INPUT | `data-p="aud.cnd44AB"` (70_sec_gen.js:L368); exported `put(j,"PartA_GEN2.Cndnfor44AB",sv(S.aud.cnd44AB))` L605 |
| `44AD` | `PartA_GEN2.BiiDetails.44AD` | — | INPUT | `data-p="aud.bii44AD"` (L370); exported at 70_sec_gen.js:L606. **MIS-TYPED** — the screen is a free-text box labelled "Turnover u/s 44AD" (`max:30`) but the schema wants `pattern "Y|N"`. |
| `44ADA` | `PartA_GEN2.BiiDetails.44ADA` | — | INPUT | `data-p="aud.bii44ADA"` (L371); exported at 70_sec_gen.js:L607. **MIS-TYPED** — the screen is a free-text box labelled "Turnover u/s 44ADA" (`max:30`) but the schema wants `pattern "Y|N"`. |
| `44AE` | `PartA_GEN2.BiiDetails.44AE` | — | INPUT | `data-p="aud.bii44AE"` (L372); exported at 70_sec_gen.js:L607. **MIS-TYPED** — the screen is a free-text box labelled "Turnover u/s 44AE" (`max:30`) but the schema wants `pattern "Y|N"`. |
| `44BB` | `PartA_GEN2.BiiDetails.44BB` | — | INPUT | `data-p="aud.bii44BB"` (L373); exported at 70_sec_gen.js:L608. **MIS-TYPED** — the screen is a free-text box labelled "Turnover u/s 44BB" (`max:30`) but the schema wants `pattern "Y|N"`. |
| `AuditedByAccountantFlg` | `PartA_GEN2.AuditedByAccountantFlg` | — | INPUT | `data-p="aud.acctFlg"` (70_sec_gen.js:L375); exported `put(j,"PartA_GEN2.AuditedByAccountantFlg",sv(S.aud.acctFlg))` L609 |
| `AuditReportFurnishDate` | `PartA_GEN2.AuditInfo.AuditReportFurnishDate` | — | INPUT | `data-p="aud.repDate"` (70_sec_gen.js:L377); exported `put(j,"PartA_GEN2.AuditInfo.AuditReportFurnishDate",ISO(S.aud.repDate))` L610 |
| `AudFrmName` | `PartA_GEN2.AuditInfo.AudFrmName` | — | INPUT | `data-p="aud.frmName"` (70_sec_gen.js:L379); exported `put(j,"PartA_GEN2.AuditInfo.AudFrmName",sv(S.aud.frmName))` L612 |
| `AudFrmPAN` | `PartA_GEN2.AuditInfo.AudFrmPAN` | req-in-parent | INPUT | `data-p="aud.frmPAN"` (70_sec_gen.js:L380); exported `put(j,"PartA_GEN2.AuditInfo.AudFrmPAN",sv(S.aud.frmPAN&&String(S.aud.frmPAN).toUpperCase()))` L613 |
| `AudFrmAadhaar` | `PartA_GEN2.AuditInfo.AudFrmAadhaar` | — | INPUT | `data-p="aud.frmAadhaar"` (70_sec_gen.js:L381); exported `put(j,"PartA_GEN2.AuditInfo.AudFrmAadhaar",sv(S.aud.frmAadhaar))` L614 |
| `AckNum44AB` | `PartA_GEN2.AuditInfo.AckNum44AB` | — | INPUT | `data-p="aud.repAck"` (70_sec_gen.js:L378); exported `put(j,"PartA_GEN2.AuditInfo.AckNum44AB",R(S.aud.repAck))` L611 |
| `LiableSec92Eflg` | `PartA_GEN2.LiableSec92Eflg` | **REQ** | INPUT | `data-p="aud.sec92E"` (70_sec_gen.js:L384); exported `put(j,"PartA_GEN2.LiableSec92Eflg",sv(S.aud.sec92E||"N"))` L615 |
| `DateOfAudit` | `PartA_GEN2.AuditDetails92E.DateOfAudit` | req-in-parent | INPUT | `data-p="aud.date92E"` (70_sec_gen.js:L388); exported `put(j,"PartA_GEN2.AuditDetails92E.DateOfAudit",ISO(S.aud.date92E))` L617 |
| `AckNum92E` | `PartA_GEN2.AuditDetails92E.AckNum92E` | req-in-parent | INPUT | `data-p="aud.ack92E"` (70_sec_gen.js:L389); exported `put(j,"PartA_GEN2.AuditDetails92E.AckNum92E",R(S.aud.ack92E))` L618 |
| `AccountAuditFlag` | `PartA_GEN2.AccountAuditFlag` | — | INPUT | `data-p="aud.acct92E"` (70_sec_gen.js:L386); exported `put(j,"PartA_GEN2.AccountAuditFlag",sv(S.aud.acct92E||"N"))` L616 |
| `AuditedSection` | `PartA_GEN2.AuditDetails[].AuditedSection` | req-in-parent | INPUT | `data-p="aud.oth.&lt;i&gt;.sec"` — grid `aud.oth` column `sec`; exported at 70_sec_gen.js:L619 |
| `AuditFlag` | `PartA_GEN2.AuditDetails[].AuditFlag` | req-in-parent | INPUT | `data-p="aud.oth.&lt;i&gt;.flag"` — grid `aud.oth` column `flag`; exported at 70_sec_gen.js:L619 |
| `DateOfAudit` | `PartA_GEN2.AuditDetails[].DateOfAudit` | — | INPUT | `data-p="aud.oth.&lt;i&gt;.date"` — grid `aud.oth` column `date`; exported at 70_sec_gen.js:L619 |
| `AckNumOth` | `PartA_GEN2.AuditDetails[].AckNumOth` | — | INPUT | `data-p="aud.oth.&lt;i&gt;.ack"` — grid `aud.oth` column `ack`; exported at 70_sec_gen.js:L619 |
| `AuditReportAct` | `PartA_GEN2.AuditReportDetails[].AuditReportAct` | req-in-parent | INPUT | `data-p="aud.act.&lt;i&gt;.act"` — grid `aud.act` column `act`; exported at 70_sec_gen.js:L621 |
| `AuditReportActOthers` | `PartA_GEN2.AuditReportDetails[].AuditReportActOthers` | — | INPUT | `data-p="aud.act.&lt;i&gt;.actOther"` — grid `aud.act` column `actOther`; exported at 70_sec_gen.js:L621 |
| `AuditReportSection` | `PartA_GEN2.AuditReportDetails[].AuditReportSection` | req-in-parent | INPUT | `data-p="aud.act.&lt;i&gt;.section"` — grid `aud.act` column `section`; exported at 70_sec_gen.js:L621 |
| `OtherITActFlag` | `PartA_GEN2.AuditReportDetails[].OtherITActFlag` | req-in-parent | INPUT | `data-p="aud.act.&lt;i&gt;.flag"` — grid `aud.act` column `flag`; exported at 70_sec_gen.js:L621 |
| `AuditReportDate` | `PartA_GEN2.AuditReportDetails[].AuditReportDate` | — | INPUT | `data-p="aud.act.&lt;i&gt;.date"` — grid `aud.act` column `date`; exported at 70_sec_gen.js:L621 |
| `PrevYrMemPartChange` | `PartA_GEN2.PrevYrMemPartChange` | **REQ** | INPUT | `data-p="pm.prevChange"` (70_sec_gen.js:L413); exported `put(j,"PartA_GEN2.PrevYrMemPartChange",sv(S.pm.prevChange||"N"))` L626 |
| `PartnerName` | `PartA_GEN2.PrevYrMemPart.PrevYrMemPartDtls[].PartnerName` | req-in-parent | INPUT | `data-p="pm.prev.&lt;i&gt;.name"` — grid `pm.prev` column `name`; exported at 70_sec_gen.js:L627 |
| `AdmRet` | `PartA_GEN2.PrevYrMemPart.PrevYrMemPartDtls[].AdmRet` | req-in-parent | INPUT | `data-p="pm.prev.&lt;i&gt;.admret"` — grid `pm.prev` column `admret`; exported at 70_sec_gen.js:L627 |
| `AdmRetDate` | `PartA_GEN2.PrevYrMemPart.PrevYrMemPartDtls[].AdmRetDate` | req-in-parent | INPUT | `data-p="pm.prev.&lt;i&gt;.date"` — grid `pm.prev` column `date`; exported at 70_sec_gen.js:L627 |
| `SharePercentage` | `PartA_GEN2.PrevYrMemPart.PrevYrMemPartDtls[].SharePercentage` | req-in-parent | INPUT | `data-p="pm.prev.&lt;i&gt;.share"` — grid `pm.prev` column `share`; exported at 70_sec_gen.js:L627 |
| `PAN` | `PartA_GEN2.PrevYrMemPart.PrevYrMemPartDtls[].PAN` | req-in-parent | INPUT | `data-p="pm.prev.&lt;i&gt;.pan"` — grid `pm.prev` column `pan`; exported at 70_sec_gen.js:L627 |
| `RemunerationpaidAmt` | `PartA_GEN2.PrevYrMemPart.PrevYrMemPartDtls[].RemunerationpaidAmt` | req-in-parent | INPUT | `data-p="pm.prev.&lt;i&gt;.remun"` — grid `pm.prev` column `remun`; exported at 70_sec_gen.js:L627 |
| `PartnerForeignCompFlg` | `PartA_GEN2.PartnerOrMemberInfo[].PartnerForeignCompFlg` | — | INPUT | `data-p="pm.bForeign"` (question B, L425); expGen rides it on `PartnerOrMemberInfo[0]` — `mem[0].PartnerForeignCompFlg` L640. **Silently dropped when the member grid has no row** (`if(mem.length)`). |
| `PercentageOfShareForeignComp` | `PartA_GEN2.PartnerOrMemberInfo[].PercentageOfShareForeignComp` | — | INPUT | `data-p="pm.cPct"` (question C, L426); rides on `mem[0]` L641-642. Dropped when the member grid is empty. |
| `TotIncFrmMemberOfAop` | `PartA_GEN2.PartnerOrMemberInfo[].TotIncFrmMemberOfAop` | — | INPUT | `data-p="pm.dExceeds"` (question D, L427); rides on `mem[0]` L641-642. Dropped when the member grid is empty. |
| `PartnerOrMemberName` | `PartA_GEN2.PartnerOrMemberInfo[].PartnerOrMemberName` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.name"` — grid `pm.members` column `name`; exported at 70_sec_gen.js:L643 |
| `AddrDetail` | `PartA_GEN2.PartnerOrMemberInfo[].AddressDetailWithZipCode.AddrDetail` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.addr"` — grid `pm.members` column `addr`; exported at 70_sec_gen.js:L643 |
| `CityOrTownOrDistrict` | `PartA_GEN2.PartnerOrMemberInfo[].AddressDetailWithZipCode.CityOrTownOrDistrict` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.city"` — grid `pm.members` column `city`; exported at 70_sec_gen.js:L643 |
| `StateCode` | `PartA_GEN2.PartnerOrMemberInfo[].AddressDetailWithZipCode.StateCode` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.state"` — grid `pm.members` column `state`; exported at 70_sec_gen.js:L643 |
| `CountryCode` | `PartA_GEN2.PartnerOrMemberInfo[].AddressDetailWithZipCode.CountryCode` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.country"` — grid `pm.members` column `country`; exported at 70_sec_gen.js:L643 |
| `PinCode` | `PartA_GEN2.PartnerOrMemberInfo[].AddressDetailWithZipCode.PinCode` | — | INPUT | `data-p="pm.members.&lt;i&gt;.pin"` — grid `pm.members` column `pin`; exported at 70_sec_gen.js:L643 |
| `ZipCode` | `PartA_GEN2.PartnerOrMemberInfo[].AddressDetailWithZipCode.ZipCode` | — | INPUT | `data-p="pm.members.&lt;i&gt;.zip"` — grid `pm.members` column `zip`; exported at 70_sec_gen.js:L643 |
| `SharePercentage` | `PartA_GEN2.PartnerOrMemberInfo[].SharePercentage` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.share"` — grid `pm.members` column `share`; exported at 70_sec_gen.js:L643 |
| `PAN` | `PartA_GEN2.PartnerOrMemberInfo[].PAN` | — | INPUT | `data-p="pm.members.&lt;i&gt;.pan"` — grid `pm.members` column `pan`; exported at 70_sec_gen.js:L643 |
| `AadhaarCardNo` | `PartA_GEN2.PartnerOrMemberInfo[].AadhaarCardNo` | — | INPUT | `data-p="pm.members.&lt;i&gt;.aadhaar"` — grid `pm.members` column `aadhaar`; exported at 70_sec_gen.js:L643 |
| `LLPIdentificationNo` | `PartA_GEN2.PartnerOrMemberInfo[].LLPIdentificationNo` | — | INPUT | `data-p="pm.members.&lt;i&gt;.dpin"` — grid `pm.members` column `dpin`; exported at 70_sec_gen.js:L643 |
| `Status` | `PartA_GEN2.PartnerOrMemberInfo[].Status` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.status"` — grid `pm.members` column `status`; exported at 70_sec_gen.js:L643 |
| `RateOfInterest` | `PartA_GEN2.PartnerOrMemberInfo[].RateOfInterest` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.roi"` — grid `pm.members` column `roi`; exported at 70_sec_gen.js:L643 |
| `RemunerationPaid` | `PartA_GEN2.PartnerOrMemberInfo[].RemunerationPaid` | req-in-parent | INPUT | `data-p="pm.members.&lt;i&gt;.remun"` — grid `pm.members` column `remun`; exported at 70_sec_gen.js:L643 |
| `PvtDiscTrustShareFlg` | `PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustShareFlg` | req-in-parent | INPUT | `data-p="pm.trust.share"` (70_sec_gen.js:L448); exported `put(j,"PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustShareFlg",sv(t.share))` L646 |
| `PvtDiscTrustBusIncFlg` | `PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustBusIncFlg` | req-in-parent | INPUT | `data-p="pm.trust.busInc"` (70_sec_gen.js:L449); exported `put(j,"PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustBusIncFlg",sv(t.busInc))` L647 |
| `PvtDiscTrustWillFlg` | `PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustWillFlg` | — | INPUT | `data-p="pm.trust.will"` (70_sec_gen.js:L450); exported `put(j,"PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustWillFlg",sv(t.will))` L648 |
| `PvtDiscTrustBasicFlg` | `PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustBasicFlg` | — | INPUT | `data-p="pm.trust.basic"` (70_sec_gen.js:L451); exported `put(j,"PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustBasicFlg",sv(t.basic))` L649 |
| `PvtDiscTrustReceivableFlg` | `PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustReceivableFlg` | — | INPUT | `data-p="pm.trust.receivable"` (70_sec_gen.js:L452); exported `put(j,"PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustReceivableFlg",sv(t.receivable))` L650 |
| `PvtDiscTrustRelativesFlg` | `PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustRelativesFlg` | — | INPUT | `data-p="pm.trust.relatives"` (70_sec_gen.js:L453); exported `put(j,"PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustRelativesFlg",sv(t.relatives))` L651 |
| `PvtDiscTrustBusProfFlg` | `PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustBusProfFlg` | — | INPUT | `data-p="pm.trust.busProf"` (70_sec_gen.js:L454); exported `put(j,"PartA_GEN2.PvtDiscretioneryTrust.PvtDiscTrustBusProfFlg",sv(t.busProf))` L652 |
| `Code` | `PartA_GEN2.NatOfBus.NatureOfBusiness[].Code` | req-in-parent | INPUT | `data-p="nob.&lt;i&gt;.code"` — grid `nob` column `code`; exported at 70_sec_gen.js:L653 |
| `TradeName1` | `PartA_GEN2.NatOfBus.NatureOfBusiness[].TradeName1` | — | INPUT | `data-p="nob.&lt;i&gt;.trade"` — grid `nob` column `trade`; exported at 70_sec_gen.js:L653 |
| `Description` | `PartA_GEN2.NatOfBus.NatureOfBusiness[].Description` | — | INPUT | `data-p="nob.&lt;i&gt;.desc"` — grid `nob` column `desc`; exported at 70_sec_gen.js:L653 |

### `ITR5.CreationInfo` — 6 leaves

| leaf | schema path | required? | class | evidence |
|---|---|:-:|:-:|---|
| `SWVersionNo` | `CreationInfo.SWVersionNo` | **REQ** | COMPUTED | pure export constant from `SKEL.CreationInfo` (10_state.js:L30-37) copied by `buildReturn(){const j=deep(SKEL)}` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `SWCreatedBy` | `CreationInfo.SWCreatedBy` | **REQ** | COMPUTED | pure export constant from `SKEL.CreationInfo` (10_state.js:L30-37) copied by `buildReturn(){const j=deep(SKEL)}` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `JSONCreatedBy` | `CreationInfo.JSONCreatedBy` | **REQ** | COMPUTED | pure export constant from `SKEL.CreationInfo` (10_state.js:L30-37) copied by `buildReturn(){const j=deep(SKEL)}` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `JSONCreationDate` | `CreationInfo.JSONCreationDate` | **REQ** | COMPUTED | pure export constant from `SKEL.CreationInfo` (10_state.js:L30-37) copied by `buildReturn(){const j=deep(SKEL)}` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `IntermediaryCity` | `CreationInfo.IntermediaryCity` | **REQ** | COMPUTED | pure export constant from `SKEL.CreationInfo` (10_state.js:L30-37) copied by `buildReturn(){const j=deep(SKEL)}` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `Digest` | `CreationInfo.Digest` | **REQ** | COMPUTED | pure export constant from `SKEL.CreationInfo` (10_state.js:L30-37) copied by `buildReturn(){const j=deep(SKEL)}` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |

### `ITR5.Form_ITR5` — 5 leaves

| leaf | schema path | required? | class | evidence |
|---|---|:-:|:-:|---|
| `FormName` | `Form_ITR5.FormName` | **REQ** | COMPUTED | pure export constant from `SKEL.Form_ITR5` (10_state.js:L38-44) copied by `buildReturn()` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `Description` | `Form_ITR5.Description` | **REQ** | COMPUTED | pure export constant from `SKEL.Form_ITR5` (10_state.js:L38-44) copied by `buildReturn()` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `AssessmentYear` | `Form_ITR5.AssessmentYear` | **REQ** | COMPUTED | pure export constant from `SKEL.Form_ITR5` (10_state.js:L38-44) copied by `buildReturn()` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `SchemaVer` | `Form_ITR5.SchemaVer` | **REQ** | COMPUTED | pure export constant from `SKEL.Form_ITR5` (10_state.js:L38-44) copied by `buildReturn()` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |
| `FormVer` | `Form_ITR5.FormVer` | **REQ** | COMPUTED | pure export constant from `SKEL.Form_ITR5` (10_state.js:L38-44) copied by `buildReturn()` (90_wiring.js:L62). No screen by design (00_form.js:L18-21). |

---

## Method (reproducible)

1. **Leaf set** — walked `definitions.ITR → ITR5 → {PartA_GEN1, PartA_GEN2, CreationInfo, Form_ITR5}` with a resolver that follows `$ref` *and* merges `allOf` (many ITR-5 flags carry their `enum` behind `allOf → nonEmptyString`-style refs, so a naive `$ref`-only walk loses every enum). 181 leaves; `required` recorded per parent and re-derived as "hard" (all ancestors required) vs "required-in-parent".
2. **Writer set** — parsed `expGen(j)` for every `put(j,"…")`, `oPut2(j,"…")`, `putArr("…")` and the two object-literal builders (`mem`, the trust block), expanded array member keys, and added the `SKEL` constants for the two meta blocks. Set difference against the leaf set: **empty both ways** (the only surplus is the array container `PartA_GEN2.PartnerOrMemberInfo` itself).
3. **Screen set** — parsed `secGen()` for every `inp("…")`, `sel("…")`, `dte("…")` and `grid("key",[{k:"…"}…])`: 122 simple + 48 grid = 170 `data-p` paths. Each writer's state expression was matched against that set; the 12 non-matches were inspected by hand and are the 11 meta constants + the fixed `91`.
4. **Gate reachability** — every conditional export branch (`if(india)`, `if(S.pi.addr2same==="N")`, `if(nri)`, `if(old)`, `if(S.aud.sec44AB==="Y")`, `if(S.fs.unl==="Y")`, …) was matched to the identical gate in `secGen()`; no export branch is gated on a condition the screen cannot produce.
5. **Assembly parity** — `70_sec_gen.js` verified present verbatim in `forms/ITR-5/Yukti_ITR5.html`.

*Report only — no form file was edited.*
