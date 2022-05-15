import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  iframeLink = '';
  imageUrl: SafeResourceUrl | undefined;
  base64Blob = '';

  form = this.fb.group({
    link: ['https://v.hexa3d.io/index.html?load=%2Fviews%2Fproduction%2Fitem%2F2020910%2F7381033550292349%2F7381033550292349.glb&autorotate=true&json-data=1599747915643&decrypt=1&webp=1&gzip=true&exp=1.5&hdr-intensity=2&le-probe=0&hdr=10&hdr-blur=true&tv=112&undefined-c=%2354b69d&watermark=1&ggwidth=300&ggheight=300&ggreferrer=https%3A%2F%2Fcms.hexa3d.io&gifgen=1',
      {validators: [Validators.required],}],
  });

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.renderer.listen('window', 'message', (event) => {
      if (event.data.action === "gifgen") {
        this.base64Blob = event.data.image;
        this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Blob);
      }
    })
  }

  onSend() {
    this.iframeLink = this.form.value.link
  }

  onDownload() {
    const byteString = window.atob(this.base64Blob.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], {type: 'image/gif'});
    const url = window.URL.createObjectURL(blob);
    let a = this.renderer.createElement('a');
    a.href = url
    // a.download = url.split('/').pop()
    a.download = "gif-filename";
    this.renderer.appendChild(this.elementRef.nativeElement,a);
    a.click()
    this.renderer.removeChild(this.elementRef.nativeElement, a)
  }
}

