# Barcode Scanner — Examples

## EAN / UPC on product packaging
You have an imported product and want the EAN-13 code for price lookup or inventory.

**Action:** snap a photo of the package barcode and upload, then click "Scan".
**Result:** outputs symbology `EAN_13` plus the 13-digit code — ready for pricing, stock, or comparison.

## Code 128 on a shipping label
Goods arrive at the warehouse and the tracking number (Code 128) must go into the system.

**Action:** point the camera at the label and scan live.
**Result:** the alphanumeric tracking number decodes and appends automatically — no manual typing, fewer entry errors.

## QR code on an event poster
An offline event poster prints a QR code and you want to check where it points.

**Action:** upload a screenshot of the poster and click "Scan".
**Result:** outputs symbology `QR_CODE` and the link text; copy it to open and verify in the browser instead of scanning with your phone.

## PDF 417 on ID / tickets
Some tickets or documents store data in a PDF 417 code.

**Action:** upload a clear photo of the ticket and scan.
**Result:** the text fields inside PDF 417 are decoded for verification, all locally with no document image leaked.

## Privacy-sensitive material
You are handling internal asset tags with barcodes that must not leave the building.

**Note:** images and camera frames are decoded entirely in your local browser, through no external server — safer than cloud scanning services.
