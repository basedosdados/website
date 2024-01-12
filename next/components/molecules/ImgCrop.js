import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function CropImage ({src}) {
  const [crop, setCrop] = useState()

  return (
    <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
      <img src={src}/>
    </ReactCrop>
  )
}
